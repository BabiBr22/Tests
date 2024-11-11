const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { User, Project, Task, Comment } = require('../models/model');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index'); // Importando sua aplicação Express

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});
  await Comment.deleteMany({});
});

// Função para gerar um token JWT válido
const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
      admin: user.is_admin,
    },
    process.env.jwt_secret_key,
    { expiresIn: '3d' }
  );
};

describe('User Tests', () => {
  it('should list all users', async () => {
    const user1 = new User({ name: 'User One', email: 'userone@example.com', password: 'password1', is_admin: false });
    const user2 = new User({ name: 'User Two', email: 'usertwo@example.com', password: 'password2', is_admin: true });
    await user1.save();
    await user2.save();

    const token = generateToken(user1);
    const response = await request(app).get('/users').set('Cookie', `Token=${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe('User One');
    expect(response.body[1].name).toBe('User Two');
  });

  it('should get a user by ID', async () => {
    const user = new User({ name: 'User One', email: 'userone@example.com', password: 'password1', is_admin: false });
    await user.save();

    const token = generateToken(user);
    const response = await request(app).get(`/users/${user._id}`).set('Cookie', `Token=${token}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('User One');
  });
});

describe('Create User Tests', () => {
  it('should create a new user', async () => {
    const adminUser = new User({ name: 'Admin User', email: 'admin@example.com', password: 'password', is_admin: true });
    await adminUser.save();

    const token = generateToken(adminUser);
    const response = await request(app)
      .post('/users')
      .set('Cookie', `Token=${token}`)
      .send({ name: 'New User', email: 'newuser@example.com', password: 'password', description: 'A new user' });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('New User');
  });

  it('should return 400 if user creation fails', async () => {
    const adminUser = new User({ name: 'Admin User', email: 'admin@example.com', password: 'password', is_admin: true });
    await adminUser.save();

    const token = generateToken(adminUser);
    const response = await request(app)
      .post('/users')
      .set('Cookie', `Token=${token}`)
      .send({ name: '', email: 'invalidemail', password: '' }); // Falha na criação
    expect(response.status).toBe(400);
  });
});

describe('Update and Delete User Tests', () => {
  it('should update a user', async () => {
    const user = new User({ name: 'User One', email: 'userone@example.com', password: 'password1', is_admin: false });
    await user.save();

    const token = generateToken(user);
    const response = await request(app)
      .post(`/users/${user._id}`)
      .set('Cookie', `Token=${token}`)
      .send({ is_admin: true });
    expect(response.status).toBe(200);
    expect(response.body.is_admin).toBe(true);
  });

  it('should return 404 if user to update is not found', async () => {
    const adminUser = new User({ name: 'Admin User', email: 'admin@example.com', password: 'password', is_admin: true });
    await adminUser.save();

    const token = generateToken(adminUser);
    const response = await request(app)
      .post('/users/nonexistent-id')
      .set('Cookie', `Token=${token}`)
      .send({ is_admin: true });
    expect(response.status).toBe(404);
  });

  it('should delete a user', async () => {
    const adminUser = new User({ name: 'Admin User', email: 'admin@example.com', password: 'password', is_admin: true });
    await adminUser.save();

    const user = new User({ name: 'User One', email: 'userone@example.com', password: 'password1', is_admin: false });
    await user.save();

    const token = generateToken(adminUser);
    const response = await request(app)
      .delete(`/users/${user._id}`)
      .set('Cookie', `Token=${token}`);
    expect(response.status).toBe(200);
  });

  it('should return 404 if user to delete is not found', async () => {
    const adminUser = new User({ name: 'Admin User', email: 'admin@example.com', password: 'password', is_admin: true });
    await adminUser.save();

    const token = generateToken(adminUser);
    const response = await request(app)
      .delete('/users/nonexistent-id')
      .set('Cookie', `Token=${token}`);
    expect(response.status).toBe(404);
  });

  it('should return 401 if unauthorized user tries to delete', async () => {
    const user = new User({ name: 'User One', email: 'userone@example.com', password: 'password1', is_admin: false });
    await user.save();

    const unauthorizedUser = new User({ name: 'Unauthorized User', email: 'unauthorized@example.com', password: 'password', is_admin: false });
    await unauthorizedUser.save();

    const token = generateToken(unauthorizedUser);
    const response = await request(app)
      .delete(`/users/${user._id}`)
      .set('Cookie', `Token=${token}`);
    expect(response.status).toBe(401);
  });
});
