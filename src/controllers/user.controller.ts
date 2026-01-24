/**
 * User controller
 * Handles HTTP requests for user operations
 */

import { Request, Response } from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../services/user.service';
import { CreateUserInputSchema, UpdateUserInputSchema } from '../types/user';

/**
 * Get all users
 * @param req - Express request object
 * @param res - Express response object
 */
export const getUsers = (_req: Request, res: Response): void => {
  try {
    const users = getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

/**
 * Get user by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export const getUser = (req: Request<{ id: string }>, res: Response): void => {
  try {
    const userId = req.params.id;
    const user = getUserById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

/**
 * Create a new user
 * @param req - Express request object
 * @param res - Express response object
 */
export const createUserHandler = (req: Request, res: Response): void => {
  try {
    // Validate input using Zod
    const validatedData = CreateUserInputSchema.parse(req.body);
    
    const newUser = createUser(validatedData);
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
};

/**
 * Update an existing user
 * @param req - Express request object
 * @param res - Express response object
 */
export const updateUserHandler = (req: Request<{ id: string }>, res: Response): void => {
  try {
    const userId = req.params.id;

    // Validate input using Zod
    const validatedData = UpdateUserInputSchema.parse(req.body);

    const updatedUser = updateUser(userId, validatedData);

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
};

/**
 * Delete a user
 * @param req - Express request object
 * @param res - Express response object
 */
export const deleteUserHandler = (req: Request<{ id: string }>, res: Response): void => {
  try {
    const userId = req.params.id;
    const deleted = deleteUser(userId);

    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};