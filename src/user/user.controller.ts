import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CustomParseIntPipe } from "../common/pipes/custom-parse-int-pipe";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {}
	@Get(":id")
	findOne(@Param("id", CustomParseIntPipe) id: string) {
		const test = this.configService.getOrThrow("TESTE", "default");
		console.log(test);
		return `controller do usuario ${id}`;
	}

	@Post()
	async create(@Body() dto: CreateUserDto) {
		return await this.userService.create(dto);
	}
}
