import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { type AuthenticatedRequest } from "../auth/types/autheticated-request";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponseDTO } from "./dto/user-response.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Get(":id")
	findOne(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
		console.log(req.user.id);
		const test = this.configService.getOrThrow("TESTE", "default");
		return `controller do usuario ${id}`;
	}

	@Post()
	async create(@Body() dto: CreateUserDto) {
		const user = await this.userService.create(dto);
		return new UserResponseDTO(user);
	}

	@UseGuards(JwtAuthGuard)
	@Patch("me")
	async update(@Req() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
		const user = await this.userService.update(req.user.id, dto);
		return new UserResponseDTO(user);
	}

	@UseGuards(JwtAuthGuard)
	@Patch("me/password")
	async updatePassword(
		@Req() req: AuthenticatedRequest,
		@Body() dto: UpdatePasswordDto,
	) {
		const user = await this.userService.updatePassword(req.user.id, dto);
		return new UserResponseDTO(user);
	}
}
