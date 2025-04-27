const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Incident = require('../models/Incident');

let token;
let adminToken;

beforeAll(async () => {
  
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-safety-incidents-test');

  // Create test user
  const user = await User.create({
    email: 'test@example.com',
    password: 'password123'
  });

  // Create admin user
  const admin = await User.create({
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  });

  const userResponse = await request(app)
    .post('/users/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });
  token = userResponse.body.token;

  const adminResponse = await request(app)
    .post('/users/login')
    .send({
      email: 'admin@example.com',
      password: 'password123'
    });
  adminToken = adminResponse.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Incidents API', () => {
  beforeEach(async () => {
    await Incident.deleteMany({});
  });

  describe('POST /incidents', () => {
    it('should create a new incident', async () => {
      const response = await request(app)
        .post('/incidents')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Incident',
          description: 'This is a test incident',
          severity: 'Medium'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Test Incident');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/incidents')
        .send({
          title: 'Test Incident',
          description: 'This is a test incident',
          severity: 'Medium'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /incidents', () => {
    it('should return paginated incidents', async () => {
     
      await Incident.create([
        {
          title: 'Incident 1',
          description: 'Description 1',
          severity: 'High',
          reported_by: new mongoose.Types.ObjectId()
        },
        {
          title: 'Incident 2',
          description: 'Description 2',
          severity: 'Medium',
          reported_by: new mongoose.Types.ObjectId()
        }
      ]);

      const response = await request(app)
        .get('/incidents')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('incidents');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.incidents).toHaveLength(2);
    });
  });

  describe('DELETE /incidents/:id', () => {
    it('should allow admin to delete incident', async () => {
      const incident = await Incident.create({
        title: 'Test Incident',
        description: 'This is a test incident',
        severity: 'Medium',
        reported_by: new mongoose.Types.ObjectId()
      });

      const response = await request(app)
        .delete(`/incidents/${incident._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
    });

    it('should not allow non-admin to delete incident', async () => {
      const incident = await Incident.create({
        title: 'Test Incident',
        description: 'This is a test incident',
        severity: 'Medium',
        reported_by: new mongoose.Types.ObjectId()
      });

      const response = await request(app)
        .delete(`/incidents/${incident._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });
}); 