import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [CommonModule],
})
export class UserModule {}
