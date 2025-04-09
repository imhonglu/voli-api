import {
  HttpExceptionBody,
  type HttpExceptionBodyMessage,
  HttpStatus,
} from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ValidationFailedException implements HttpExceptionBody {
  @ApiProperty({
    example: "email must be an email",
  })
  message!: HttpExceptionBodyMessage;

  @ApiProperty({ example: "Bad Request" })
  error!: string;

  @ApiProperty({ enum: HttpStatus, example: HttpStatus.BAD_REQUEST })
  statusCode!: HttpStatus;
}
