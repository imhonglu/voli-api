import { relative } from "node:path";
import { EnvConfigService } from "@/config/env-config.service";
import { Media } from "@/database/entities/media.entity";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Queue } from "bullmq";
import { Repository } from "typeorm";
import { UploadMediaDto } from "./dto/upload-media.dto";
import { MediaCleanupJob } from "./media-cleanup.consumer";
import { MEDIA_CLEANUP_JOB_NAME } from "./media.constants";

@Injectable()
export class MediaService {
  constructor(
    private readonly configService: EnvConfigService,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectQueue(MEDIA_CLEANUP_JOB_NAME)
    private readonly queue: Queue<MediaCleanupJob>,
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

  async remove(id: number) {
    const media = await this.mediaRepository.findOneByOrFail({ id });

    await this.mediaRepository.softRemove(media);
    await this.queue.add(MEDIA_CLEANUP_JOB_NAME, { media });

    return media;
  }
}
