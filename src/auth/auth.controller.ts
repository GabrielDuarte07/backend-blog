import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { LoginDto } from "./dto/login-dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	login(@Body() loginDto: LoginDto): any {
		return this.authService.loginService(loginDto);
	}
}
