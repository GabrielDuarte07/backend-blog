import {
	Controller,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { fileFilter, limits, storage } from "../upload/upload.config";
import { UploadService } from "./upload.service";

@Controller("upload")
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor("file", { storage, limits, fileFilter }))
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		return this.uploadService.handleUpload(file);
	}
}
