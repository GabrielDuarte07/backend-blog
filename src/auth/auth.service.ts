import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HashingService } from "../common/hashing/hasing.service";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login-dto";
import { JwtPayload } from "./types/jwt-payload.type";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly hashingService: HashingService,
		private readonly jwtService: JwtService,
	) {}

	async login(loginDTO: LoginDto) {
		const user = await this.userService.findByEmail(loginDTO.email);
		const error = new UnauthorizedException("User or password invalid");

		if (!user) {
			throw error;
		}

		const isPasswordValid = await this.hashingService.compare(
			loginDTO.password,
			user.password,
		);

		if (!isPasswordValid) {
			throw error;
		}

		const jwtPayload: JwtPayload = {
			sub: user.id,
			email: user.email,
		};

		const accessToken = await this.jwtService.signAsync(jwtPayload);

		user.forceLogout = false;

		return { accessToken };
	}
}
