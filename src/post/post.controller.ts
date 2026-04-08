import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Req,
	UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { type AuthenticatedRequest } from "../auth/types/autheticated-request";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostResponseDTO } from "./dto/post-response.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostService } from "./post.service";

@Controller("post")
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UseGuards(JwtAuthGuard)
	@Post("me")
	async create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePostDto) {
		const created = await this.postService.create(dto, req.user.id);
		return created;
	}

	@UseGuards(JwtAuthGuard)
	@Get("me/:id")
	async findOneOwned(
		@Req() req: AuthenticatedRequest,
		@Param("id", ParseUUIDPipe) id: string,
	) {
		const post = await this.postService.findOneOwned({ id }, req.user);
		return new PostResponseDTO(post);
	}

	@UseGuards(JwtAuthGuard)
	@Get("me")
	async findAllOwned(@Req() req: AuthenticatedRequest) {
		const posts = await this.postService.findAllOwned(req.user);
		return posts.map((post) => new PostResponseDTO(post));
	}

	@UseGuards(JwtAuthGuard)
	@Patch("me/:id")
	async update(
		@Param("id", ParseUUIDPipe) id: string,
		@Req() req: AuthenticatedRequest,
		@Body() dto: UpdatePostDto,
	) {
		const updated = await this.postService.update({ id }, dto, req.user);
		return updated;
	}
}
