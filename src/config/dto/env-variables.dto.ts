import { join } from "node:path";
import { IsEnum, IsNumber, IsString, Max, Min } from "class-validator";
import { getAppRootPath } from "../utils/get-app-root-path";

export enum NodeEnv {
  Local = "local",
  Development = "dev",
  Production = "prod",
  Test = "test",
}

export class EnvVariables {
  @IsString()
  APP_ROOT_PATH = getAppRootPath();

  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Local;

  @Min(0)
  @Max(65535)
  PORT = 3000;

  @IsString()
  POSTGRES_USER = "postgres";

  @IsString()
  POSTGRES_PASSWORD = "postgres";

  @IsString()
  POSTGRES_DB = "postgres";

  @IsNumber()
  POSTGRES_PORT = 5432;

  @IsString()
  POSTGRES_HOST = "localhost";

  @IsString()
  REDIS_HOST = "localhost";

  @IsNumber()
  REDIS_PORT = 6379;

  @IsNumber()
  MAX_FILE_SIZE = 10 * 1024 * 1024;

  @IsString()
  ACCEPTED_MIME_PREFIX = "audio";

  @IsString()
  MEDIA_DIRECTORY_PATH = join(this.APP_ROOT_PATH, "media");
}
