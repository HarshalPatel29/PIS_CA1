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
  return app;
};

