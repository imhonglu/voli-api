import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: "Health Check" })
  @ApiOkResponse({ example: "ok" })
  healthCheck(): string {
    return "ok";
  }
}
