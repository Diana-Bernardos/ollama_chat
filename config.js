// config.js
const config = {
    OLLAMA_API_URL: 'http://localhost:11434/api/generate',
    MODEL_NAME: 'llama3.2:1b-instruct-fp16',
    PORT: 3000,
    DB: {
        host: 'localhost',
        user: 'root',
        password: 'Dianaleire',
        database: 'ollama_chat'
    }
};

module.exports = config;