import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { unlink } from "node:fs/promises";
import { extname, join } from "node:path";
import { getSystemErrorName } from "node:util";
import { EnvConfigService } from "@/config/env-config.service";
import { Request } from "@/types/request.interface";
import Busboy from "@fastify/busboy";
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Logger,
  NestInterceptor,
  Type,
  mixin,
} from "@nestjs/common";
import { UnsupportedFileTypeException } from "./exceptions/unsupported-file-type.exception";
import { UploadedFile } from "./types/uploaded-file.interface";
import { hasContentTypeHeader } from "./utils/has-content-type-header";
import { loadDetectFileType } from "./utils/load-detect-file-type";

export function FileInterceptor(fieldName: string): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    private readonly logger = new Logger(FileInterceptor.name);

    private readonly maxFileSize: number;
    private readonly acceptedMimePrefix: string;
    private readonly mediaDir: string;

    constructor(
      @Inject(EnvConfigService)
      private readonly configService: EnvConfigService,
    ) {
      this.maxFileSize = this.configService.get("MAX_FILE_SIZE");
      this.acceptedMimePrefix = this.configService.get("ACCEPTED_MIME_PREFIX");
      this.mediaDir = this.configService.get("MEDIA_DIRECTORY_PATH");
    }

    async intercept(context: ExecutionContext, next: CallHandler) {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest<Request>();
      const { headers } = req;

      if (!req.body) {
        req.body = {};
      }

      if (!hasContentTypeHeader(headers)) {
        req.body[fieldName] = undefined;

        return next.handle();
      }

      const detectFileType = await loadDetectFileType();
      const busboy = new Busboy({
        headers,
        limits: {
          fileSize: this.maxFileSize,
          fieldNameSize: Buffer.byteLength(fieldName, "utf-8"),
        },
      });

      const body: Record<string, unknown> = {};

      await new Promise<void>((resolve, reject) => {
        const generatedFileName = this.generateFileName();
        const path = join(this.mediaDir, generatedFileName);
        const writeStream = createWriteStream(path);

        busboy.on("field", (fieldname, value) => {
          body[fieldname] = value;
        });

        busboy.on(
          "file",
          async (fieldname, file, originalFileName, encoding, mimetype) => {
            let mimeType = mimetype;
            let ext = extname(originalFileName);
            let fileSize = 0;

            let isFirstChunk = true;
            let error: Error | undefined;

            for await (const chunk of file) {
              if (isFirstChunk) {
                isFirstChunk = false;
                const detectedFileType = await detectFileType(chunk);

                if (detectedFileType) {
                  mimeType = detectedFileType.mime;
                  ext = detectedFileType.ext;
                }

                if (!mimeType.startsWith(this.acceptedMimePrefix)) {
                  error = new UnsupportedFileTypeException(mimeType);
                }
              }

              if (error) {
                file.resume();
              } else {
                fileSize += chunk.length;
                writeStream.write(chunk);
              }
            }

            if (error) {
              writeStream.destroy();
              busboy.destroy(error);
            }

            body[fieldname] = {
              originalFileName,
              fileName: generatedFileName,
              fileSize,
              ext,
              encoding,
              mimeType,
              path,
            } satisfies UploadedFile;
          },
        );

        busboy.on("finish", () => {
          req.body = body;
          resolve();
        });

        busboy.on("error", async (err) => {
          unlink(path).catch((err) => {
            if (getSystemErrorName(err.errno) !== "ENOENT") {
              this.logger.error(err);
            }
          });
          reject(err);
        });

        req.pipe(busboy);
      });

      return next.handle();
    }

    private generateFileName() {
      return randomUUID();
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
}
