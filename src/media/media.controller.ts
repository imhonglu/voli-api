import { ValidationFailedException } from "@/exception/exceptions/validation-failed.exception";
import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiOperation,
} from "@nestjs/swagger";
import { UploadMediaDto } from "./dto/upload-media.dto";
import { FileInterceptor } from "./file.interceptor";
import { FILE_FIELD_NAME } from "./media.constants";
import { MediaService } from "./media.service";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor(FILE_FIELD_NAME))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "이미지 업로드" })
  @ApiBadRequestResponse({ type: ValidationFailedException })
  create(@Body() body: UploadMediaDto) {
    return this.mediaService.upload(body);
  }
}
