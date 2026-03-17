import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
	@IsString({ message: "name must be a string" })
	@IsNotEmpty({ message: "name can`t be empty" })
	name: string;

	@IsEmail({}, { message: "Invalid e-mail" })
	email: string;

	@IsString({ message: "Password must be a string" })
	@IsNotEmpty({ message: "Password can`t be empty" })
	password: string;
}
