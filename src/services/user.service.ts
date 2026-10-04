import type { IUserRepository } from '../repositories/IUserRepository';
import type { User } from '../entities/User';
import {
  CreateUserInputSchema,
  UpdateUserInputSchema,
  UserIdSchema,
  ListUsersSchema,
} from '../types/user';
import { ApiError } from '../errors';

/** Business operations with explicit dependencies and validated service inputs. */
export class UserService {
  constructor(private readonly users: IUserRepository) {}
  async getAll(input: unknown = {}): Promise<User[]> {
    return this.users.findAll(ListUsersSchema.parse(input));
  }
  async getById(id: string): Promise<User> {
    const user = await this.users.findById(UserIdSchema.parse(id));
    if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    return user;
  }
  async create(input: unknown): Promise<User> {
    return this.users.create(CreateUserInputSchema.parse(input));
  }
  async update(id: string, input: unknown): Promise<User> {
    const validId = UserIdSchema.parse(id);
    const user = await this.users.update(validId, UpdateUserInputSchema.parse(input));
    if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    return user;
  }
  async delete(id: string): Promise<void> {
    if (!(await this.users.delete(UserIdSchema.parse(id)))) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }
  }
}
