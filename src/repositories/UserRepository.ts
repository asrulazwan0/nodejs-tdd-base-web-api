import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/User';
import { IUserRepository } from './IUserRepository';

export class UserRepository implements IUserRepository {
  private userRepository: Repository<User>;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return user || null;
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    Object.assign(user, userData);
    return await this.userRepository.save(user);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected !== 0;
  }
}