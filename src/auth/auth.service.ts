import { Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login-dto";

@Injectable()
export class AuthService {
	loginService(loginDTO: LoginDto): LoginDto {
		return loginDTO;
	}
}
