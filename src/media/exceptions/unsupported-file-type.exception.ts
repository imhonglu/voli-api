import { BadRequestException } from "@nestjs/common";

export class UnsupportedFileTypeException extends BadRequestException {
  constructor(type: string) {
    super(`지원하지 않는 파일 유형입니다: ${type}`);
  }
}
