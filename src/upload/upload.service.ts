import { BadRequestException, Injectable } from "@nestjs/common";
import { fileTypeFromBuffer } from "file-type";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { generateRandomSuffix } from "../common/utils/generate-random-suffix";

@Injectable()
export class UploadService {
	async handleUpload(file: Express.Multer.File) {
		if (!file) {
			throw new BadRequestException("file not sent");
		}

		const maxSizeFile = 900 * 1024;

		if (file.size > maxSizeFile) {
			throw new BadRequestException("file not sent");
		}

		const fileType = await fileTypeFromBuffer(file.buffer);

		if (
			!fileType ||
			!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
				fileType.mime,
			)
		) {
			throw new BadRequestException("Invalid file or invalid type");
		}

		const today = new Date().toISOString().split("T")[0];
		const uploadPath = resolve(__dirname, "..", "..", "uploads", today);

		if (!existsSync(uploadPath)) {
			mkdirSync(uploadPath, { recursive: true });
		}

		const uniqueSuffix = `${Date.now()}-${generateRandomSuffix()}`;
		const fileExtension = fileType.ext;
		const fileName = `${uniqueSuffix}.${fileExtension}`;
		const fileFullPath = resolve(uploadPath, fileName);

		writeFileSync(fileFullPath, file.buffer);

		return {
			url: `/uploads/${today}/${fileName}`,
		};
	}
}
