import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
	@IsString({ message: "Password must be a string" })
	@IsNotEmpty({ message: "Password can`t be empty" })
	currentPassword: string;

	@IsString({ message: "New Password must be a string" })
	@IsNotEmpty({ message: "New Password can`t be empty" })
	@MinLength(6, {
		message: "Minimal of 6 characteres for password is required",
	})
	newPassword: string;
}
