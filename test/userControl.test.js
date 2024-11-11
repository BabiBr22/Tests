const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index"); // Certifique-se de exportar sua aplicação em `index.js`
const User = require("../models/model").User;

beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    await User.deleteMany(); // Limpa a coleção após cada teste
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Controller: createUser", () => {
    it("Deve criar um usuário com sucesso", async () => {
        const res = await request(app)
            .post("/api/users")
            .send({ name: "Test User", email: "test@example.com", password: "password123" });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("name", "Test User");
    });

    it("Deve retornar erro 400 se faltar campos obrigatórios", async () => {
        const res = await request(app)
            .post("/api/users")
            .send({ name: "", email: "" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Campos obrigatórios faltando"); // Verifique a mensagem de erro esperada
    });
});

describe("Controller: listUsers", () => {
    it("Deve listar todos os usuários", async () => {
        await User.create({ name: "User One", email: "userone@example.com", password: "password123" });
        await User.create({ name: "User Two", email: "usertwo@example.com", password: "password123" });

        const res = await request(app).get("/api/users");

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });
});

describe("Controller: updateUser", () => {
    it("Deve atualizar o status de administrador de um usuário", async () => {
        const user = await User.create({ name: "User", email: "user@example.com", password: "password123" });

        const res = await request(app)
            .patch(`/api/users/${user._id}`)
            .send({ is_admin: true });

        expect(res.statusCode).toBe(200);
        expect(res.body.is_admin).toBe(true);
    });
});

describe("Controller: deleteUser", () => {
    it("Deve deletar um usuário", async () => {
        const user = await User.create({ name: "User", email: "user@example.com", password: "password123" });

        const res = await request(app).delete(`/api/users/${user._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Usuário deletado com sucesso");
    });

    it("Deve retornar erro 404 se o usuário não for encontrado", async () => {
        const invalidId = mongoose.Types.ObjectId();
        const res = await request(app).delete(`/api/users/${invalidId}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Usuário não encontrado"); // Verifique a mensagem de erro esperada
    });
});
