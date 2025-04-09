import {
  ArgumentsHost,
  Catch,
  ConflictException,
  HttpException,
  HttpServer,
  IntrinsicException,
} from "@nestjs/common";
import { AbstractHttpAdapter, BaseExceptionFilter } from "@nestjs/core";
import { UnexpectedServerException } from "./exceptions/unexpected-server.exception";
import { PostgresError, isPostgresError } from "./utils/is-postgres-error";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }

  handleUnknownError(
    exception: unknown,
    host: ArgumentsHost,
    applicationRef: AbstractHttpAdapter | HttpServer,
  ) {
    const { error, cause } = this.processException(exception);
    const httpResponse = host.getArgByIndex(1);

    if (!applicationRef.isHeadersSent(httpResponse)) {
      applicationRef.reply(
        httpResponse,
        error.getResponse(),
        error.getStatus(),
      );
    } else {
      applicationRef.end(httpResponse);
    }

    if (cause) {
      // @ts-expect-error
      AllExceptionsFilter.logger.error(cause);
    }
  }

  private processException(exception: unknown): {
    error: HttpException;
    cause: unknown;
  } {
    if (isPostgresError(exception)) {
      return this.handlePostgresError(exception);
    }

    const cause =
      exception instanceof IntrinsicException ? exception : undefined;

    if (this.isHttpError(exception)) {
      return {
        error: new HttpException(exception.message, exception.statusCode),
        cause,
      };
    }

    return {
      error: new UnexpectedServerException(),
      cause,
    };
  }

  private handlePostgresError(
    exception: PostgresError,
  ): ReturnType<typeof this.processException> {
    switch (exception.driverError.code) {
      case "23505":
        return {
          error: new ConflictException("이미 존재하는 데이터입니다."),
          cause: exception.driverError.detail,
        };

      default:
        return {
          error: new UnexpectedServerException(),
          cause: exception,
        };
    }
  }
}
