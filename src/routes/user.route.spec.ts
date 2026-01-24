/**
 * User route tests
 * Tests for the user API endpoints
 */

import request from 'supertest';
import { app } from '../test.app';
import { setupTestDatabase, tearDownTestDatabase } from '../test-helpers';
import { TestDataSource } from '../config/test.database';

// Mock the database connection for tests
beforeAll(async () => {
  await setupTestDatabase();
});

afterEach(async () => {
  // Clear the users table after each test
  await TestDataSource.query('DELETE FROM users');
});

afterAll(async () => {
  await tearDownTestDatabase();
});

describe('User Routes', () => {
  // Sample user data for testing
  const sampleUserData = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe'
  };

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/users')
        .send(sampleUserData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(sampleUserData.email);
      expect(response.body.firstName).toBe(sampleUserData.firstName);
      expect(response.body.lastName).toBe(sampleUserData.lastName);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should return 400 when creating a user with invalid data', async () => {
      const invalidUserData = {
        email: 'invalid-email',
        firstName: '', // Empty first name should fail validation
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/users')
        .send(invalidUserData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
    });
  });

  describe('GET /users/:id', () => {
    it('should return a specific user by ID', async () => {
      // First create a user
      const createUserResponse = await request(app)
        .post('/users')
        .send(sampleUserData)
        .expect(201);

      const userId = createUserResponse.body.id;

      // Then get the user by ID
      const response = await request(app)
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe(sampleUserData.email);
    });

    it('should return 404 when getting a non-existent user', async () => {
      const fakeUserId = 'non-existent-id';

      const response = await request(app)
        .get(`/users/${fakeUserId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('PUT /users/:id', () => {
    it('should update an existing user', async () => {
      // First create a user
      const createUserResponse = await request(app)
        .post('/users')
        .send(sampleUserData)
        .expect(201);

      const userId = createUserResponse.body.id;
      const updatedData = {
        firstName: 'Jane',
        email: 'jane@example.com'
      };

      // Then update the user
      const response = await request(app)
        .put(`/users/${userId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.firstName).toBe(updatedData.firstName);
      expect(response.body.email).toBe(updatedData.email);
      // Verify that updatedAt exists and is a valid date
      expect(new Date(response.body.updatedAt).getTime()).toBeGreaterThan(0);
    });

    it('should return 400 when updating with invalid data', async () => {
      // First create a user
      const createUserResponse = await request(app)
        .post('/users')
        .send(sampleUserData)
        .expect(201);

      const userId = createUserResponse.body.id;
      const invalidData = {
        firstName: '', // Invalid first name
        email: 'invalid-email'
      };

      // Then try to update with invalid data
      const response = await request(app)
        .put(`/users/${userId}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
    });

    it('should return 404 when updating a non-existent user', async () => {
      const fakeUserId = 'non-existent-id';
      const updatedData = {
        firstName: 'Jane'
      };

      const response = await request(app)
        .put(`/users/${fakeUserId}`)
        .send(updatedData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete an existing user', async () => {
      // First create a user
      const createUserResponse = await request(app)
        .post('/users')
        .send(sampleUserData)
        .expect(201);

      const userId = createUserResponse.body.id;

      // Then delete the user
      await request(app)
        .delete(`/users/${userId}`)
        .expect(204);

      // Verify the user is gone
      await request(app)
        .get(`/users/${userId}`)
        .expect(404);
    });

    it('should return 404 when deleting a non-existent user', async () => {
      const fakeUserId = 'non-existent-id';

      const response = await request(app)
        .delete(`/users/${fakeUserId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User not found');
    });
  });
});