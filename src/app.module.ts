import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PostModule } from "./post/post.module";
import { UserModule } from "./user/user.module";

@Module({
	imports: [AuthModule, UserModule, PostModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
