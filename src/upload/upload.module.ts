import { join } from "node:path";
import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

@Module({
	controllers: [UploadController],
	providers: [UploadService],
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "..", "..", "uploads"),
			serveRoot: "/uploads",
			serveStaticOptions: {
				fallthrough: false,
				index: false,
			},
		}),
	],
})
export class UploadModule {}
