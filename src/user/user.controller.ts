import { Controller, Get, Param } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CustomParseIntPipe } from "../common/pipes/custom-parse-int-pipe";

@Controller("user")
export class UserController {
	constructor(private readonly configService: ConfigService) {}
	@Get(":id")
	findOne(@Param("id", CustomParseIntPipe) id: string) {
		const test = this.configService.getOrThrow("TESTE", "default");
		console.log(test);
		return `controller do usuario ${id}`;
	}
}
