import { EnvConfigModule } from "@/config/env-config.module";
import { Media } from "@/database/entities/media.entity";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaCleanupConsumer } from "./media-cleanup.consumer";
import { MEDIA_CLEANUP_JOB_NAME } from "./media.constants";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";

@Module({
  imports: [
    EnvConfigModule.forFeature(),
    TypeOrmModule.forFeature([Media]),
    BullModule.registerQueue({
      name: MEDIA_CLEANUP_JOB_NAME,
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, MediaCleanupConsumer],
})
export class MediaModule {}
