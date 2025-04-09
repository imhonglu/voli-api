import { NotFoundException } from "@nestjs/common";

export class EntityNotFoundException extends NotFoundException {
  constructor() {
    super("요청하신 데이터를 찾을 수 없습니다.");
  }
}
