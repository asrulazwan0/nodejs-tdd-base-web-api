/**
 * User service
 * Contains business logic for user operations
 */

import { User } from '../entities/User';
import { CreateUserInput, UpdateUserInput } from '../types/user';
import { UserRepository } from '../repositories/UserRepository';
import { Container } from 'typedi';

/**
 * Get all users
 * @returns Array of all users
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const userRepository = Container.get(UserRepository);
    return await userRepository.findAll();
  } catch (error) {
    console.error('Error retrieving users:', error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param id - User ID
 * @returns User object or null if not found
 */
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const userRepository = Container.get(UserRepository);
    return await userRepository.findById(id);
  } catch (error) {
    console.error('Error retrieving user:', error);
    throw error;
  }
};

/**
 * Create a new user
 * @param userData - User data to create
 * @returns Created user object
 */
export const createUser = async (userData: CreateUserInput): Promise<User> => {
  try {
    const userRepository = Container.get(UserRepository);

    const newUser = await userRepository.create({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update an existing user
 * @param id - User ID to update
 * @param userData - Updated user data
 * @returns Updated user object or null if not found
 */
export const updateUser = async (id: string, userData: UpdateUserInput): Promise<User | null> => {
  try {
    const userRepository = Container.get(UserRepository);

    const updatedUser = await userRepository.update(id, {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete a user
 * @param id - User ID to delete
 * @returns True if deleted, false if not found
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const userRepository = Container.get(UserRepository);
    return await userRepository.delete(id);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};