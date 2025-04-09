import { QueryFailedError } from "typeorm";

export function isQueryFailedError(error: unknown): error is QueryFailedError {
  return (
    typeof error === "object" &&
    error !== null &&
    "query" in error &&
    "parameters" in error &&
    "driverError" in error
  );
}
