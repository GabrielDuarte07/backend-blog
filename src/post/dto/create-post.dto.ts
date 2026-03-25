import {
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	Length,
} from "class-validator";

export class CreatePostDto {
	@IsString({ message: "Title must be a string" })
	@Length(10, 150, { message: "Title must have between 10 and 150 characters" })
	title: string;

	@IsString({ message: "Excerpt must be a string" })
	@Length(10, 200, {
		message: "Excerpt must have between 10 and 200 characters ",
	})
	excerpt: string;

	@IsString({ message: "Content must be a string" })
	@IsNotEmpty({ message: "Content can`t be empty" })
	content: string;

	@IsOptional()
	@IsUrl({ require_tld: false }, { message: "Invalid URL" })
	coverImageUrl?: string;
}
