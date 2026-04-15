import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { createSlugFromText } from "../common/utils/create-slug-from-text";
import { Post, User } from "../db/prisma/client";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

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

	async findOne(postData: Partial<Post>) {
		const post = await this.prisma.post
			.findFirstOrThrow({
				where: { id: postData.id },
				include: { author: true },
			})
			.catch(() => {
				throw new NotFoundException("Post not found");
			});

		return post;
	}

	async findAll(postData: Partial<Post>) {
		const posts = await this.prisma.post.findMany({
			where: { ...postData },
			include: { author: true },
			orderBy: { createdAt: "desc" },
		});

		return posts;
	}

	async findOneOwned(postData: Partial<Post>, author: User) {
		const post = await this.prisma.post
			.findFirstOrThrow({
				where: { id: postData.id, author: { id: author.id } },
				include: { author: true },
			})
			.catch(() => {
				throw new NotFoundException("Post not found");
			});

		return post;
	}

	async findAllOwned(author: User) {
		const posts = await this.prisma.post.findMany({
			where: { author: { id: author.id } },
			include: { author: true },
			orderBy: { createdAt: "desc" },
		});

		return posts;
	}

	async update(postData: Partial<Post>, dto: UpdatePostDto, author: User) {
		if (Object.keys(dto).length === 0) {
			throw new BadRequestException("Data not sent");
		}

		const post = await this.prisma.post
			.findFirstOrThrow({
				where: { id: postData.id, author: { id: author.id } },
			})
			.catch(() => {
				throw new NotFoundException("Post not found");
			});

		post.title = dto.title ?? post.title;
		post.content = dto.content ?? post.content;
		post.excerpt = dto.excerpt ?? post.excerpt;
		post.coverImageUrl = dto.coverImageUrl ?? post.coverImageUrl;
		post.published = dto.published ?? post.published;

		const updated = await this.prisma.post.update({
			where: { id: post.id },
			data: post,
		});

		return updated;
	}

	async remove(id: string, author: User) {
		await this.prisma.post
			.findFirstOrThrow({
				where: { id, author: { id: author.id } },
			})
			.catch(() => {
				throw new NotFoundException("Post not found");
			});
		const deleted = await this.prisma.post.delete({ where: { id } });
		return deleted;
	}
}
