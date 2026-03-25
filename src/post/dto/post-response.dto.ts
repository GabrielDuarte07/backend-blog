export class PostResponseDTO {
	readonly id: string;
	readonly title: string;
	readonly slug: string;
	readonly content: string;
	readonly excerpt: string;
	readonly coverImageUrl: string;
	readonly published: boolean;
	readonly createdAt: Date;
	readonly updatedAt: Date;

	constructor(post: any) {
		this.id = post.id;
		this.title = post.title;
		this.slug = post.slug;
		this.content = post.content;
		this.excerpt = post.excerpt;
		this.coverImageUrl = post.coverImageUrl;
		this.published = post.published;
		this.createdAt = post.createdAt;
		this.updatedAt = post.updatedAt;
	}
}
