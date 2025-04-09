import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { EnvConfigService } from "@/config/env-config.service";
import { Media } from "@/database/entities/media.entity";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { MEDIA_CLEANUP_JOB_NAME } from "./media.constants";

export interface MediaCleanupJob {
  media: Media;
}

@Processor(MEDIA_CLEANUP_JOB_NAME)
export class MediaCleanupConsumer extends WorkerHost {
  private readonly logger = new Logger(MediaCleanupConsumer.name);
  private readonly mediaDir: string;

  constructor(private readonly configService: EnvConfigService) {
    super();

    this.mediaDir = this.configService.get("MEDIA_DIRECTORY_PATH");
  }

  async process(job: Job<MediaCleanupJob>) {
    const { media } = job.data;

    try {
      await unlink(join(this.mediaDir, media.path));
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
