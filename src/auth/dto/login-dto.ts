import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
	@IsEmail({}, { message: "Invalid E-mail" })
	email: string;

	@IsNotEmpty({ message: "Invalid Password" })
	password: string;
}
