import {
	BadRequestException,
	Controller,
	Post,
	Req,
	UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { type AuthenticatedRequest } from "../auth/types/autheticated-request";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostService } from "./post.service";

@Controller("post")
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UseGuards(JwtAuthGuard)
	@Post("me")
	async create(@Req() req: AuthenticatedRequest, dto: CreatePostDto) {
		const created = await this.postService.create(dto, req.user.id);
		return created;
	}
}
