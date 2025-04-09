import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { EnvVariables } from "../dto/env-variables.dto";

export function validateConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
