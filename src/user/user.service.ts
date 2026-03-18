import { ConflictException, Injectable } from "@nestjs/common";
import { HashingService } from "../common/hashing/hasing.service";
import { PrismaService } from "../common/prisma/prisma.service";
import { User } from "../db/prisma/client";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private hashingService: HashingService,
	) {}

	async create(dto: CreateUserDto) {
		const alreadyExists = await this.prisma.user.findFirst({
			where: { email: dto.email },
		});

		if (alreadyExists) {
			throw new ConflictException("e-mail alredy exists");
		}

		const hashedPassword = await this.hashingService.hash(dto.password);
		const newUser: CreateUserDto = {
			name: dto.name,
			email: dto.email,
			password: hashedPassword,
		};

		const created = await this.prisma.user.create({ data: newUser });
		return created;
	}

	async findByEmail(email: string) {
		return await this.prisma.user.findFirst({ where: { email } });
	}

	async save(userData: User) {
		return await this.prisma.user.update({
			where: { id: userData.id },
			data: userData,
		});
	}
}
