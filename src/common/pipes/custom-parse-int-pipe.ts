import { BadRequestException, ParseIntPipe } from "@nestjs/common";

export class CustomParseIntPipe extends ParseIntPipe {
	constructor() {
		super({
			exceptionFactory: () => new BadRequestException("Param must be numeric"),
		});
	}
}
