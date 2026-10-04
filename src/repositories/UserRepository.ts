import { type DataSource, type Repository, QueryFailedError } from 'typeorm';
import { User } from '../entities/User';
import type { IUserRepository } from './IUserRepository';
import type { CreateUserInput, UpdateUserInput, ListUsersInput } from '../types/user';
import { emailConflict } from '../errors';

/** MySQL is the authority for uniqueness, including concurrent requests. */
export class UserRepository implements IUserRepository {
  private readonly users: Repository<User>;
  constructor(dataSource: DataSource) {
    this.users = dataSource.getRepository(User);
  }
  findAll({ limit, offset }: ListUsersInput): Promise<User[]> {
    return this.users.find({ take: limit, skip: offset, order: { createdAt: 'ASC', id: 'ASC' } });
  }
  findById(id: string): Promise<User | null> {
    return this.users.findOneBy({ id });
  }
  async create(input: CreateUserInput): Promise<User> {
    try {
      return await this.users.save(this.users.create(input));
    } catch (error) {
      return this.translate(error);
    }
  }
  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    try {
      const result = await this.users.update(id, {
        ...input,
        updatedAt: () => 'CURRENT_TIMESTAMP(6)',
      });
      return result.affected ? this.findById(id) : null;
    } catch (error) {
      return this.translate(error);
    }
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.users.delete(id);
    return (result.affected ?? 0) > 0;
  }
  private translate(error: unknown): never {
    if (
      error instanceof QueryFailedError &&
      typeof error.driverError === 'object' &&
      error.driverError !== null &&
      'code' in error.driverError &&
      error.driverError.code === 'ER_DUP_ENTRY'
    ) {
      throw emailConflict();
    }
    throw error;
  }
}
