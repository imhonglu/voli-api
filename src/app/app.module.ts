import { EnvConfigModule } from "@/config/env-config.module";
import { EnvConfigService } from "@/config/env-config.service";
import { logger } from "@/logger/logger.middleware";
import { MediaModule } from "@/media/media.module";
import { BullModule } from "@nestjs/bullmq";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
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

    BullModule.forRootAsync({
      imports: [EnvConfigModule.forFeature()],
      useFactory: (configService: EnvConfigService) => ({
        connection: {
          host: configService.get("REDIS_HOST"),
          port: configService.get("REDIS_PORT"),
        },
      }),
      inject: [EnvConfigService],
    }),

    MediaModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes("*");
  }
}
