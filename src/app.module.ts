import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./common/prisma/prisma.module";
import { PostModule } from "./post/post.module";
import { UserModule } from "./user/user.module";

@Module({
	imports: [
		AuthModule,
		UserModule,
		PostModule,
		PrismaModule,
		ConfigModule.forRoot({ isGlobal: true }),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
