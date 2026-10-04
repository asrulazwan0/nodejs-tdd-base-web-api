import { randomUUID } from 'node:crypto';
import type { IUserRepository } from '../../src/repositories/IUserRepository';
import type { User } from '../../src/entities/User';
import type { CreateUserInput, UpdateUserInput, ListUsersInput } from '../../src/types/user';
import { emailConflict } from '../../src/errors';

/** Controlled service dependency; MySQL integration independently proves persistence. */
export class MemoryRepository implements IUserRepository {
  readonly data = new Map<string, User>();
  findAll({ limit, offset }: ListUsersInput): Promise<User[]> {
    return Promise.resolve([...this.data.values()].slice(offset, offset + limit));
  }
  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.data.get(id) ?? null);
  }
  async create(input: CreateUserInput): Promise<User> {
    this.checkEmail(input.email);
    const user: User = { ...input, id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    this.data.set(user.id, user);
    return user;
  }
  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const user = this.data.get(id);
    if (!user) return null;
    if (input.email) this.checkEmail(input.email, id);
    const updated = { ...user, ...input, updatedAt: new Date() };
    this.data.set(id, updated);
    return updated;
  }
  async delete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }
  private checkEmail(email: string, id?: string): void {
    if ([...this.data.values()].some((user) => user.email === email && user.id !== id))
      throw emailConflict();
  }
}
