import type { User } from '../entities/User';
import type { CreateUserInput, UpdateUserInput, ListUsersInput } from '../types/user';

/** Service boundary; implementations translate expected uniqueness failures. */
export interface IUserRepository {
  findAll(pagination: ListUsersInput): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
