import { BadRequestException } from "@nestjs/common";
import { memoryStorage } from "multer";

export const storage = memoryStorage();

export const fileFilter = (
	req: unknown,
	file: Express.Multer.File,
	cb: (error: Error | null, acceptFile: boolean) => void,
) => {
	if (!file.mimetype.startsWith("image/")) {
		return cb(new BadRequestException("Only images allowed"), false);
	}

	cb(null, true);
};

export const limits = {};
