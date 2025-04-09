import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvConfigService } from "./env-config.service";
import { validateConfig } from "./utils/validate-config";

@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: Dynamic module
export class EnvConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: EnvConfigModule,
      imports: [ConfigModule.forRoot({ validate: validateConfig })],
    };
  }

  static forFeature(): DynamicModule {
    const providers = [EnvConfigService];

    return {
      module: EnvConfigModule,
      providers,
      exports: providers,
    };
  }
}
