/**
 * User service
 * Contains business logic for user operations
 */

import { User, CreateUserInput, UpdateUserInput } from '../types/user';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for demonstration purposes
// In a real application, this would be replaced with a database
const users: User[] = [];

/**
 * Get all users
 * @returns Array of all users
 */
export const getAllUsers = (): User[] => {
  return users;
};

/**
 * Get user by ID
 * @param id - User ID
 * @returns User object or null if not found
 */
export const getUserById = (id: string): User | null => {
  return users.find(user => user.id === id) || null;
};

/**
 * Create a new user
 * @param userData - User data to create
 * @returns Created user object
 */
export const createUser = (userData: CreateUserInput): User => {
  const newUser: User = {
    id: uuidv4(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(newUser);
  return newUser;
};

/**
 * Update an existing user
 * @param id - User ID to update
 * @param userData - Updated user data
 * @returns Updated user object or null if not found
 */
export const updateUser = (id: string, userData: UpdateUserInput): User | null => {
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return null;
  }

  // Update user properties
  const userToUpdate = users[userIndex]!;
  const updatedUser: User = {
    id: userToUpdate.id,
    email: userData.email ?? userToUpdate.email,
    firstName: userData.firstName ?? userToUpdate.firstName,
    lastName: userData.lastName ?? userToUpdate.lastName,
    createdAt: userToUpdate.createdAt,
    updatedAt: new Date(),
  };

  users[userIndex] = updatedUser;
  return updatedUser;
};

/**
 * Delete a user
 * @param id - User ID to delete
 * @returns True if deleted, false if not found
 */
export const deleteUser = (id: string): boolean => {
  const initialLength = users.length;
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
  }

  return users.length !== initialLength;
};