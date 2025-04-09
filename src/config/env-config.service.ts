import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvVariables } from "./dto/env-variables.dto";

@Injectable()
export class EnvConfigService extends ConfigService<EnvVariables, true> {
  get<K extends keyof EnvVariables>(path: K): EnvVariables[K] {
    return super.get(path);
  }
}
