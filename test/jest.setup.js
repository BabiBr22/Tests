// jest.setup.js
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});

// jest.setup.js
afterAll(async () => {
    await mongoose.connection.close(); // Assegura o fechamento da conexão
});


// jest.config.js
module.exports = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    // outras configurações do Jest
};
