import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { AllExceptionnsFilter } from "./common/filters/all-execptions.filter";
import { PrismaModule } from "./common/prisma/prisma.module";
import { PostModule } from "./post/post.module";
import { UploadModule } from "./upload/upload.module";
import { UserModule } from "./user/user.module";

@Module({
	imports: [
		AuthModule,
		UserModule,
		PostModule,
		PrismaModule,
		ConfigModule.forRoot({ isGlobal: true }),
		UploadModule,
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: 10000,
					limit: 10,
					blockDuration: 5000,
				},
			],
		}),
	],
	controllers: [],
	providers: [
		{
			provide: APP_FILTER,
			useClass: AllExceptionnsFilter,
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
