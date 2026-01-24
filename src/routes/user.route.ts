/**
 * User routes
 * Defines the API endpoints for user operations
 */

import express from 'express';
import { 
  getUsers, 
  getUser, 
  createUserHandler, 
  updateUserHandler, 
  deleteUserHandler 
} from '../controllers/user.controller';

export const userRouter = express.Router();

/**
 * GET /users
 * Retrieve all users
 */
userRouter.get('/', getUsers);

/**
 * GET /users/:id
 * Retrieve a specific user by ID
 */
userRouter.get('/:id', getUser);

/**
 * POST /users
 * Create a new user
 */
userRouter.post('/', createUserHandler);

/**
 * PUT /users/:id
 * Update an existing user
 */
userRouter.put('/:id', updateUserHandler);

/**
 * DELETE /users/:id
 * Delete a user
 */
userRouter.delete('/:id', deleteUserHandler);