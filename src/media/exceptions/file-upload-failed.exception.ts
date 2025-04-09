import { BadRequestException, HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class FileUploadFailedException extends BadRequestException {
  @ApiProperty({
    example: "파일 업로드에 실패했습니다.",
  })
  message!: string;

  @ApiProperty({ example: "Bad Request" })
  error!: string;

  @ApiProperty({ enum: HttpStatus, example: HttpStatus.BAD_REQUEST })
  statusCode!: HttpStatus;
}
