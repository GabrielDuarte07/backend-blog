import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { createSlugFromText } from "../common/utils/create-slug-from-text";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostService {
	private readonly logger = new Logger(PostService.name);

	constructor(private prisma: PrismaService) {}

	async create(dto: CreatePostDto, authorId: string) {
		const post = await this.prisma.post
			.create({
				data: {
					title: dto.title,
					excerpt: dto.excerpt,
					content: dto.content,
					userId: authorId,
					slug: createSlugFromText(dto.title),
				},
				include: { author: { select: { name: true, email: true, id: true } } },
			})
			.catch((error: unknown) => {
				if (error instanceof Error) {
					this.logger.error("error during post creation", error.stack);
				}
				throw new BadRequestException("error during post creation");
			});
		return post;
	}
}
