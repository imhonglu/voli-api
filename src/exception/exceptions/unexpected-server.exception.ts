import { HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class UnexpectedServerException extends InternalServerErrorException {
  @ApiProperty({ example: "알 수 없는 오류가 발생했습니다." })
  message!: string;

  @ApiProperty({ example: "Internal Server Error" })
  error!: string;

  @ApiProperty({
    enum: HttpStatus,
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  statusCode!: HttpStatus;

  constructor(
    ...args: ConstructorParameters<typeof InternalServerErrorException>
  ) {
    const [message = "알 수 없는 오류가 발생했습니다.", ...rest] = args;
    super(message, ...rest);
  }
}
