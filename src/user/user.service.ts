import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { HashingService } from "../common/hashing/hasing.service";
import { PrismaService } from "../common/prisma/prisma.service";
import { User } from "../db/prisma/client";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePasswordDto } from "./dto/update-password";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private hashingService: HashingService,
	) {}

	async failIfEmailExists(email: string) {
		const exists = await this.prisma.user.findFirst({ where: { email } });

		if (exists) {
			throw new ConflictException("E-mail already exists");
		}

		return;
	}

	async findOneOrFail(userData: Partial<User>): Promise<User> {
		const user = await this.prisma.user
			.findFirstOrThrow({
				where: { id: userData.id },
			})
			.catch(() => {
				throw new NotFoundException("User not found");
			});

		return user;
	}

	async create(dto: CreateUserDto) {
		await this.failIfEmailExists(dto.email);

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

	async findByID(id: string) {
		const user = await this.prisma.user.findFirst({ where: { id } });
		if (!user) {
			throw new NotFoundException("User not found");
		}
		return user;
	}

	async update(id: string, dto: UpdateUserDto) {
		if (!dto.email && !dto.name) {
			throw new BadRequestException("Data not sent");
		}

		const user = await this.findOneOrFail({ id });

		user.name = dto.name ?? user.name;

		if (dto.email && dto.email !== user.email) {
			await this.failIfEmailExists(dto.email);
			user.email = dto.email;
			user.forceLogout = true;
		}

		const updated = await this.prisma.user.update({ data: dto, where: { id } });
		return updated;
	}

	async updatePassword(id: string, dto: UpdatePasswordDto) {
		const user = await this.findOneOrFail({ id });

		const isCurrentPasswordValid = await this.hashingService.compare(
			dto.currentPassword,
			user.password,
		);

		if (!isCurrentPasswordValid) {
			throw new UnauthorizedException("Current password invalid");
		}

		user.password = await this.hashingService.hash(dto.newPassword);
		user.forceLogout = true;

		const updated = await this.prisma.user.update({
			data: user,
			where: { id },
		});
		return updated;
	}

	async save(userData: User) {
		return await this.prisma.user.update({
			where: { id: userData.id },
			data: userData,
		});
	}
}
