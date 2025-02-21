const request = require('supertest');
const app = require('./app'); // Your Express app
const mongoose = require('mongoose');

describe('API Tests', () => {
  // Close the database connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/health', () => {
    it('should return a 200 status and a health message', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Server is healthy' });
    });
  });

  describe('GET /api/user/dashboard', () => {
    it('should return a 401 error if the user is not authenticated', async () => {
      const response = await request(app).get('/api/user/dashboard');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('msg', 'No token, authorization denied');
    });
  });

  describe('GET /api/user/sections', () => {
    it('should return a 401 error if the user is not authenticated', async () => {
      const response = await request(app).get('/api/user/sections');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/user/ebooks/:id/request', () => {
    it('should return a 401 error if the user is not authenticated', async () => {
      const response = await request(app).post('/api/user/ebooks/123/request');
      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/user/me', () => {
    it('should return a 401 error if the user is not authenticated', async () => {
      const response = await request(app).delete('/api/user/me');
      expect(response.status).toBe(401);
    });
  });
});
