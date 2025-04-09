import { DatabaseError } from "pg";
import { QueryFailedError } from "typeorm";
import { isQueryFailedError } from "./is-query-failed-error";

export type PostgresError = QueryFailedError<DatabaseError>;

export function isPostgresError(error: unknown): error is PostgresError {
  return (
    isQueryFailedError(error) && error.driverError instanceof DatabaseError
  );
}
