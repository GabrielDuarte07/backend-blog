import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { CustomParseIntPipe } from "../common/pipes/custom-parse-int-pipe";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {}

	@UseGuards(AuthGuard("jwt"))
	@Get(":id")
	findOne(@Param("id") id: string) {
		const test = this.configService.getOrThrow("TESTE", "default");
		return `controller do usuario ${id}`;
	}

	@Post()
	async create(@Body() dto: CreateUserDto) {
		return await this.userService.create(dto);
	}
}
