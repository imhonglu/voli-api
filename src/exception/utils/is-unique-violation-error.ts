import { DatabaseError } from "pg";
import { QueryFailedError } from "typeorm";
import { isPostgresError } from "./is-postgres-error";

export function isUniqueViolationError(
  error: unknown,
): error is QueryFailedError<DatabaseError> {
  return isPostgresError(error) && error.driverError.code === "23505";
}
