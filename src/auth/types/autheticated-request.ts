import { type Request } from "express";
import { User } from "../../db/prisma/client";

export interface AuthenticatedRequest extends Request {
	user: User;
}
