// services/chatService.js
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

// Almacenamiento en memoria para sesiones y mensajes
const sessions = {};

class ChatService {
    async generateResponse(message, sessionId = null) {
        try {
            // Si no hay sessionId, crear uno nuevo
            if (!sessionId) {
                sessionId = uuidv4();
                sessions[sessionId] = [];
            }

            // Guardar mensaje del usuario en memoria
            this.saveMessage(sessionId, message, true);

            // Generar respuesta con Ollama
            const response = await axios.post(config.OLLAMA_API_URL, {
                model: config.MODEL_NAME,
                prompt: message,
                stream: false
            });
            const botResponse = response.data.response;

            // Guardar respuesta del bot en memoria
            this.saveMessage(sessionId, botResponse, false);

            return {
                success: true,
                data: botResponse,
                sessionId
            };
        } catch (error) {
            console.error('Error en ChatService:', error);
            return {
                success: false,
                error: 'Error al generar respuesta',
                sessionId
            };
        }
    }

    saveMessage(sessionId, message, isUser) {
        sessions[sessionId].push({
            text: message,
            isUser
        });
    }

    async getChatHistory(sessionId) {
        try {
            return sessions[sessionId] || [];
        } catch (error) {
            console.error('Error obteniendo historial:', error);
            return [];
        }
    }

    async deleteChat(sessionId) {
        try {
            delete sessions[sessionId];
            return true;
        } catch (error) {
            console.error('Error eliminando chat:', error);
            return false;
        }
    }
}

module.exports = new ChatService();