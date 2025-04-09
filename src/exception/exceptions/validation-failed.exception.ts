import {
  HttpExceptionBody,
  type HttpExceptionBodyMessage,
  HttpStatus,
} from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ValidationFailedException implements HttpExceptionBody {
  @ApiProperty({
    example: "이메일 형식이 올바르지 않습니다.",
  })
  message!: HttpExceptionBodyMessage;

  @ApiProperty({ example: "Bad Request" })
  error!: string;

  @ApiProperty({ enum: HttpStatus, example: HttpStatus.BAD_REQUEST })
  statusCode!: HttpStatus;
}
