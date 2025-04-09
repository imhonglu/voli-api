import { EnvConfigModule } from "@/config/env-config.module";
import { EnvConfigService } from "@/config/env-config.service";
import { MediaModule } from "@/media/media.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";

@Module({
  imports: [
    EnvConfigModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [EnvConfigModule.forFeature()],
      useFactory: (configService: EnvConfigService) => ({
        type: "postgres",
        host: configService.get("POSTGRES_HOST"),
        port: configService.get("POSTGRES_PORT"),
        username: configService.get("POSTGRES_USER"),
        password: configService.get("POSTGRES_PASSWORD"),
        database: configService.get("POSTGRES_DB"),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [EnvConfigService],
    }),

    MediaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
