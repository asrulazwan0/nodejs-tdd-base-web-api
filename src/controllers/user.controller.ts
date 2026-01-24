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
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
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
export const getUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);

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
export const createUserHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input using Zod
    const validatedData = CreateUserInputSchema.parse(req.body);

    const newUser = await createUser(validatedData);
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
export const updateUserHandler = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    // Validate input using Zod
    const validatedData = UpdateUserInputSchema.parse(req.body);

    const updatedUser = await updateUser(userId, validatedData);

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
export const deleteUserHandler = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const deleted = await deleteUser(userId);

    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};