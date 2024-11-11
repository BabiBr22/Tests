// const request = require('supertest');
// const app = require('../index.js');  // Corrigido o caminho do arquivo
// const mongoose = require('mongoose');
// const { Project, User } = require('../models/model.js'); // Atualize conforme necessário

// // Variável para armazenar o token e o id do usuário
// let token = '';
// let userId = '';

// // Conecte-se ao banco de dados de teste antes dos testes
// beforeAll(async () => {
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(process.env.TEST_DB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   }

//   // Crie um usuário de teste com um email único
//   const email = `testuser${Date.now()}@example.com`;
//   const user = await User.create({
//     name: 'Test User',
//     email: email,
//     password: 'password123',
//   });

//   userId = user._id;  // Armazenando o id do usuário criado

//   // Simule o login para obter o token
//   const loginResponse = await request(app)
//     .post('/login')
//     .send({
//       email: email,
//       password: 'password123',
//     });

//   token = loginResponse.body.token; // Supondo que o token seja retornado no corpo da resposta
//   if (!token) {
//     throw new Error('Token de autenticação não gerado');
//   }
// });

// // Feche a conexão com o banco de dados após os testes
// afterAll(async () => {
//   await mongoose.connection.dropDatabase(); // Limpa o banco de dados após os testes
//   await mongoose.disconnect();
// });

// describe('Testes do Controller de Projetos', () => {
//   it('Deve criar um projeto', async () => {
//     const response = await request(app)
//       .post('/projects')
//       .set('Authorization', `Bearer ${token}`) // Passa o token de autenticação
//       .send({
//         name: 'Novo Projeto',
//         description: 'Descrição do Novo Projeto',
//         userId: userId,  // Usando o ID do usuário criado
//       });

//     expect(response.status).toBe(201);  // Espera 201, criação bem-sucedida
//     expect(response.body.name).toBe('Novo Projeto');
//     expect(response.body.description).toBe('Descrição do Novo Projeto');
//     expect(response.body.userId.toString()).toBe(userId.toString());  // Verifica se o projeto tem o usuário correto
//   });

//   it('Deve listar todos os projetos', async () => {
//     const response = await request(app)
//       .get('/projects')
//       .set('Authorization', `Bearer ${token}`) // Passa o token de autenticação

//     expect(response.status).toBe(200);  // Espera 200, sucesso
//     expect(Array.isArray(response.body)).toBe(true);  // Verifica se o retorno é um array
//   });
// });
