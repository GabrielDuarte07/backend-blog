import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
	@IsString({ message: "name must be a string" })
	@IsNotEmpty({ message: "name can`t be empty" })
	name: string;

	@IsEmail({}, { message: "Invalid e-mail" })
	email: string;

	@IsString({ message: "Password must be a string" })
	@IsNotEmpty({ message: "Password can`t be empty" })
	@MinLength(6, {
		message: "Minimal of 6 characteres for password is required",
	})
	password: string;
}
