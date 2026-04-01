import type { UserDto } from "../dto/user";

declare global {
  namespace Express {
    interface Request {
      user?: UserDto | null;
    }
  }
}
