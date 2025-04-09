import { join } from "node:path";
import {
  HttpStatus,
  Logger,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import pkg from "../package.json";
import { AppModule } from "./app/app.module";
import { EnvConfigService } from "./config/env-config.service";
import { AllExceptionsFilter } from "./exception/all-exceptions.filter";
import { UnexpectedServerException } from "./exception/exceptions/unexpected-server.exception";
import { API_VERSION, GLOBAL_PREFIX, OPENAPI_PATH } from "./main.constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const configService = app.get(EnvConfigService);
  const port = configService.get("PORT");

  app.enableCors();
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION.DEFAULT,
    prefix: API_VERSION.PREFIX,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  SwaggerModule.setup(OPENAPI_PATH, app, () =>
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(pkg.name)
        .setDescription(pkg.description)
        .addGlobalResponse({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          type: UnexpectedServerException,
        })
        .build(),
    ),
  );

  await app.listen(port, "0.0.0.0");

  const url = join(await app.getUrl(), OPENAPI_PATH);
  Logger.log(`🚀 Application is running on: ${url}`);
}
bootstrap();
