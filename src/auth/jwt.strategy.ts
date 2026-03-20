import {
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../user/user.service";
import { JwtPayload } from "./types/jwt-payload.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly userService: UserService) {
		const secret = process.env.JWT_SECRET;

		if (!secret) {
			throw new InternalServerErrorException("JWT_SECRET not found in .env");
		}

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: secret,
		});
	}

	async validate(jwtPayload: JwtPayload) {
		const user = await this.userService.findByID(jwtPayload.sub);

		if (!user || user.forceLogout) {
			throw new UnauthorizedException("You must log in first");
		}

		return user;
	}
}
