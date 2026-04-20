import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { parseCorsWhitelist } from "./common/utils/parse-cors-whitelist";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const corsWhiteList = parseCorsWhitelist(process.env.CORS_WHITELIST ?? "");

	app.use(
		helmet({
			crossOriginResourcePolicy: { policy: "cross-origin" },
		}),
	);

	app.enableCors({
		origin: (
			origin: string | undefined,
			callback: (...args: unknown[]) => void,
		) => {
			if (!origin || corsWhiteList.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error("Not allowed by CORS"), false);
		},
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);
	await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
