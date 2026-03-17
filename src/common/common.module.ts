import { Module } from "@nestjs/common";
import { BcryptHashingService } from "./hashing/bcrypt-hashing.service";
import { HashingService } from "./hashing/hasing.service";

@Module({
	providers: [
		{
			provide: HashingService,
			useClass: BcryptHashingService,
		},
	],
	exports: [HashingService],
})
export class CommonModule {}
