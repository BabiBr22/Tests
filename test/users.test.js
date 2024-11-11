const request = require('supertest');
const app = require('../../app'); // Atualize o caminho conforme necessário
const mongoose = require('mongoose');
const { User } = require('../../models/model'); // Atualize o caminho conforme necessário

describe('User API', () => {
  let userId;
  let adminToken; // Simule um token de administrador, se necessário

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
    // Crie um usuário administrador de exemplo para autenticação, se necessário
    const adminUser = new User({ name: 'Admin', email: 'admin@example.com', is_admin: true });
    await adminUser.save();
    adminToken = 'Bearer fake_admin_token'; // Aqui, use um token real ou implemente um mock, se necessário
  });

  afterAll(async () => {
    await User.deleteMany(); // Limpe os dados de teste
    await mongoose.connection.close();
  });

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', adminToken)
      .send({ name: 'Test User', description: 'A user for testing' });
      
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test User');
    userId = response.body._id;
  });

  it('should list all users', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', adminToken);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a specific user by ID', async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', adminToken);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(userId);
  });

  it('should update the user role to admin', async () => {
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .set('Authorization', adminToken)
      .send({ is_admin: true });

    expect(response.status).toBe(200);
    expect(response.body.is_admin).toBe(true);
  });

  it('should delete a user by ID', async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', adminToken);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(userId);
  });
});
