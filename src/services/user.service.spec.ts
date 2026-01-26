/**
 * User service tests
 * Tests for the user business logic
 */

import { User } from '../entities/User';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from './user.service';
import { UserRepository } from '../repositories/UserRepository';

// Mock the UserRepository
const mockUserRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Define the update behavior after the mock is created
mockUserRepository.update.mockImplementation(async (id, userData) => {
  // Simulate the real repository's behavior: first check if user exists
  const existingUser = await mockUserRepository.findById(id);

  if (!existingUser) {
    return null;
  }

  // If user exists, return updated user with the new data
  return {
    ...existingUser,
    ...userData,
  };
});

// Mock the Container.get method to return our mock repository
jest.mock('typedi', () => {
  const actualTypedi = jest.requireActual('typedi');
  const mockContainerGet = jest.fn((token) => {
    if (token === UserRepository || (typeof token === 'function' && token.name === 'UserRepository')) {
      return mockUserRepository;
    }
    // Return actual instances for other tokens if needed
    return actualTypedi.Container.get(token);
  });

  return {
    ...actualTypedi,
    Container: {
      ...actualTypedi.Container,
      get: mockContainerGet,
    },
  };
});

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the mock implementation to ensure proper tracking of calls
    mockUserRepository.update.mockImplementation(async (id, userData) => {
      // Simulate the real repository's behavior: first check if user exists
      const existingUser = await mockUserRepository.findById(id);

      if (!existingUser) {
        return null;
      }

      // If user exists, return updated user with the new data
      return {
        ...existingUser,
        ...userData,
      };
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      const result = await getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when repository fails', async () => {
      const errorMessage = 'Database error';
      mockUserRepository.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(getAllUsers()).rejects.toThrow(errorMessage);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await getUserById('1');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null when user is not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const result = await getUserById('1');

      expect(result).toBeNull();
    });

    it('should throw an error when repository fails', async () => {
      const errorMessage = 'Database error';
      mockUserRepository.findById.mockRejectedValue(new Error(errorMessage));

      await expect(getUserById('1')).rejects.toThrow(errorMessage);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const expectedUser: User = {
        id: '1',
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.create.mockResolvedValue(expectedUser);

      const result = await createUser(userData);

      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    });

    it('should throw an error when repository fails', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const errorMessage = 'Database error';
      mockUserRepository.create.mockRejectedValue(new Error(errorMessage));

      await expect(createUser(userData)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const userId = '1';
      const userData = {
        email: 'updated@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const existingUser: User = {
        id: userId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser: User = {
        ...existingUser,
        ...userData,
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      // Don't mock update separately - let the mock implementation handle it

      const result = await updateUser(userId, userData);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, userData);
    });

    it('should return null when user to update is not found', async () => {
      const userId = '1';
      const userData = {
        email: 'updated@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      mockUserRepository.findById.mockResolvedValue(null);

      const result = await updateUser(userId, userData);

      expect(result).toBeNull();
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, expect.any(Object));
    });

    it('should throw an error when repository fails', async () => {
      const userId = '1';
      const userData = {
        email: 'updated@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const errorMessage = 'Database error';
      mockUserRepository.findById.mockRejectedValue(new Error(errorMessage));

      await expect(updateUser(userId, userData)).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = '1';
      const deleteResult = true;

      mockUserRepository.delete.mockResolvedValue(deleteResult);

      const result = await deleteUser(userId);

      expect(result).toBe(deleteResult);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should return false when user to delete is not found', async () => {
      const userId = '1';
      const deleteResult = false;

      mockUserRepository.delete.mockResolvedValue(deleteResult);

      const result = await deleteUser(userId);

      expect(result).toBe(deleteResult);
    });

    it('should throw an error when repository fails', async () => {
      const userId = '1';
      const errorMessage = 'Database error';
      mockUserRepository.delete.mockRejectedValue(new Error(errorMessage));

      await expect(deleteUser(userId)).rejects.toThrow(errorMessage);
    });
  });
});