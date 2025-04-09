import { AppModule } from "@/app/app.module";
import { MediaModule } from "@/media/media.module";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { App } from "supertest/types";

describe("MediaController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MediaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/media (POST)", () => {
    const formData = new FormData();
    return request(app.getHttpServer()).post("/media").expect(200).expect("ok");
  });
});
