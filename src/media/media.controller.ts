import { RequestId } from "@/decorators/request-id.decorator";
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiOperation,
} from "@nestjs/swagger";
import { UploadMediaDto } from "./dto/upload-media.dto";
import { FileUploadFailedException } from "./exceptions/file-upload-failed.exception";
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
  @ApiBadRequestResponse({ type: FileUploadFailedException })
  create(@Body() body: UploadMediaDto) {
    return this.mediaService.upload(body);
  }

  @Delete(":id")
  @ApiOperation({ summary: "이미지 삭제" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.mediaService.remove(id);
  }
}
