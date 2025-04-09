import { relative } from "node:path";
import { EnvConfigService } from "@/config/env-config.service";
import { Media } from "@/database/entities/media.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UploadMediaDto } from "./dto/upload-media.dto";

@Injectable()
export class MediaService {
  constructor(
    private readonly configService: EnvConfigService,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  upload(dto: UploadMediaDto) {
    const { file, userId } = dto;

    const media = this.mediaRepository.create({
      ...file,
      path: relative(this.configService.get("MEDIA_DIRECTORY_PATH"), file.path),
      userId,
    });

    return this.mediaRepository.save(media);
  }
}
