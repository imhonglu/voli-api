import { EnvConfigModule } from "@/config/env-config.module";
import { Media } from "@/database/entities/media.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";

@Module({
  imports: [EnvConfigModule.forFeature(), TypeOrmModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
