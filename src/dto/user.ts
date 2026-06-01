import type { RoleModel, UserModel } from '../models';

export class UserDto {
  email: string;
  id: number;
  isActivate: boolean;
  role: RoleModel['name'];

  constructor(userModel: UserModel) {
    this.email = userModel.email;
    this.id = userModel.id;
    this.isActivate = userModel.isActivate;
    this.role = userModel.role?.name ?? 'user';
  }
}

export const isUserDto = (value: unknown): value is UserDto => {
  return typeof value === 'object' && value !== null && 'email' in value;
};
