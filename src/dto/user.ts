import type { UserModel } from "../models";

export class UserDto {
  email: string;
  id: number;
  isActivate: boolean;
  role: string;

  constructor(userModel: UserModel) {
    this.email = userModel.email;
    this.id = userModel.id;
    this.isActivate = userModel.isActivate;
    this.role = userModel.role;
  }
}
