const request = require('supertest');
const app = require('../index'); // Seu arquivo principal do Express
const mongoose = require('mongoose');
const Comment = require('../models/model').Comment; // Supondo que o modelo do comentário seja 'Comment'
const Task = require('../models/model').Task; // Supondo que o modelo de tarefa seja 'Task'

beforeAll(async () => {
  // Conectar ao banco de dados de teste
  await mongoose.connect('mongodb+srv://RBrignoli-mongodb:1WCsrSisiM1eqjny@cluster0.whtyih7.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Limpeza: Remover os dados de teste e fechar a conexão com o banco de dados
  await Comment.deleteMany();
  await Task.deleteMany();
  await mongoose.connection.close();
});

describe('GET /tasks/:id/comments', () => {
  let taskId;
  let userId;

  beforeAll(async () => {
    // Cria uma tarefa de teste
    const task = new Task({ name: 'Test Task' });
    const savedTask = await task.save();
    taskId = savedTask._id;

    // Criar um ObjectId de usuário simulado
    userId = new mongoose.Types.ObjectId();

    // Cria um comentário associado à tarefa e ao usuário
    const comment = new Comment({ task: taskId, text: 'Test comment', user: userId });
    await comment.save();
  });

  it('should return comments for a specific task', async () => {
    const response = await request(app).get(`/tasks/${taskId}/comments`);

    // Verificar se o status da resposta é 200 (OK)
    expect(response.status).toBe(200);

    // Verificar se a resposta contém um array de comentários
    expect(Array.isArray(response.body)).toBe(true);

    // Verificar se o comentário tem a estrutura esperada
    expect(response.body[0]).toHaveProperty('text', 'Test comment');
    expect(response.body[0]).toHaveProperty('task', taskId.toString());
    expect(response.body[0]).toHaveProperty('user', userId.toString()); // Verificar o ID do usuário
  });

  it('should return 500 if there is an error', async () => {
    // Para testar o erro, podemos simular um erro no modelo ou banco de dados
    jest.spyOn(Comment, 'find').mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get(`/tasks/${taskId}/comments`);
    
    // Verificar se o status da resposta é 500 (Erro do servidor)
    expect(response.status).toBe(500); // Corrigido para 500
    expect(response.body).toHaveProperty('message', 'Database error');
  });
});
