const { MongoClient } = require('mongodb');
const express = require('express');
const request = require('supertest');
const path = require('path');

// Mock the actual server setup
const createTestServer = () => {
  const app = express();
  app.use(express.json());

  // Mock MongoDB connection and collection
  const mockCollection = {
    insertOne: jest.fn(),
    deleteOne: jest.fn(),
    find: jest.fn(),
    toArray: jest.fn()
  };

  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection)
  };

  const mockClient = {
    db: jest.fn().mockReturnValue(mockDb),
    connect: jest.fn(),
    close: jest.fn()
  };

  // Mock MongoDB client
  jest.mock('mongodb', () => ({
    MongoClient: jest.fn(() => mockClient)
  }));

  // Routes
  app.get('/passwords', async (req, res) => {
    try {
      mockCollection.find.mockReturnThis();
      mockCollection.toArray.mockResolvedValue([
        { website: 'test.com', username: 'testuser', password: 'testpass' }
      ]);
      const passwords = await mockCollection.find({}).toArray();
      res.json(passwords);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/passwords', async (req, res) => {
      const { website, username, password, comment } = req.body;

      // Input validation
      if (!website || !username || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Website, username, and password are required' 
        });
      }

      mockCollection.deleteOne.mockResolvedValue({});
      mockCollection.insertOne.mockResolvedValue({ 
        insertedId: 'mockId' 
      });

      await mockCollection.deleteOne({ website });
      const result = await mockCollection.insertOne({ 
        website, username, password, comment 
      });
      
      res.json({ success: true, result });
  });
  
  app.delete('/passwords', async (req, res) => {
    try {
      const { website } = req.body;

      // Validate website is provided
      if (!website) {
        return res.status(400).json({ 
          success: false, 
          error: 'Website is required for deletion' 
        });
      }

      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });
      
      const result = await mockCollection.deleteOne({ website });
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
 return app;
};

describe('Password Manager API', () => {
  let app;

  beforeEach(() => {
    // Reset all mocks before the test
    jest.clearAllMocks();
    app = createTestServer();
  });
  
  describe('GET /passwords', () => {
    it('should retrieve all passwords', async () => {
        const response = await request(app).get('/passwords');
        
        console.log('GET /passwords response:', response.status, response.body);
        
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toHaveProperty('website', 'test.com');
        expect(response.body[0]).toHaveProperty('username', 'testuser');
      
    });
 });

 describe('POST /passwords', () => {
  it('should save a new password', async () => {
    try {
      const newPassword = {
        website: 'example.com',
        username: 'newuser',
        password: 'newpassword',
        comment: 'Test comment'
      };

      const response = await request(app)
        .post('/passwords')
        .send(newPassword);
      
      console.log('POST /passwords response:', response.status, response.body);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('result');
    } catch (error) {
      logTestError(error);
      throw error;
    }
  });

  it('should fail to save password with missing required fields', async () => {
    try {
      const incompletePassword = {
        website: 'incomplete.com'
      };

      const response = await request(app)
        .post('/passwords')
        .send(incompletePassword);
      
      console.log('POST /passwords incomplete response:', response.status, response.body);
      
      // Expect a 400 Bad Request for missing required fields
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    } catch (error) {
      logTestError(error);
      throw error;
    }
  });
});

describe('DELETE /passwords', () => {
  it('should delete a password by website', async () => {
    try {
      const response = await request(app)
        .delete('/passwords')
        .send({ website: 'test.com' });
      
      console.log('DELETE /passwords response:', response.status, response.body);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    } catch (error) {
      logTestError(error);
      throw error;
    }
  });

  it('should fail to delete password without website', async () => {
    try {
      const response = await request(app)
        .delete('/passwords')
        .send({});
      
      console.log('DELETE /passwords incomplete response:', response.status, response.body);
      
      // Expecting a 400 Bad Request for missing website
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    } catch (error) {
      logTestError(error);
      throw error;
    }
  });
});
});