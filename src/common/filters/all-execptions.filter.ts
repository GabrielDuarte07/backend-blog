import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionnsFilter implements ExceptionFilter {
	private readonly logger = new Logger(AllExceptionnsFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse<Response>();

		const isHttpException = exception instanceof HttpException;

		const status = isHttpException
			? exception.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR;

		const defaultMessage = "Internal Server Error";
		const defaultError = "Internal Server Error";

		let messages: string[] = [defaultMessage];
		let errorName = defaultError;

		if (isHttpException) {
			const responseData = exception.getResponse();

			if (typeof responseData === "string") {
				messages = [responseData];
			}

			if (typeof responseData === "object" && responseData !== null) {
				const { message, error } = responseData as Record<string, unknown>;

				if (Array.isArray(message)) {
					messages = message as string[];
				} else if (typeof message === "string") {
					messages = [message];
				}

				if (typeof error === "string") {
					errorName = error;
				}
			}
		}

		if (!(exception instanceof HttpException)) {
			this.logger.error(
				"Unexpected error",
				(exception as Error).stack || "no stack",
			);
		} else {
			this.logger.warn(`${status} - ${errorName} - ${messages.join(" | ")}`);
		}

		return response.status(status).json({
			message: messages,
			error: errorName,
			statusCode: status,
		});
	}
}
