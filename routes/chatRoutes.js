// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');

// Ruta para enviar mensajes
router.post('/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Mensaje requerido' });
        }

        const response = await chatService.generateResponse(message, sessionId);
        
        if (!response.success) {
            return res.status(500).json({ error: response.error });
        }

        res.json({
            response: response.data,
            sessionId: response.sessionId
        });
    } catch (error) {
        console.error('Error en la ruta /chat:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para obtener historial
router.get('/chat/history/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const history = await chatService.getChatHistory(sessionId);
        res.json(history);
    } catch (error) {
        console.error('Error obteniendo historial:', error);
        res.status(500).json({ error: 'Error obteniendo historial' });
    }
});

// Ruta para eliminar una conversación
router.delete('/chat/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        await chatService.deleteChat(sessionId);
        res.json({ message: 'Chat eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando chat:', error);
        res.status(500).json({ error: 'Error eliminando chat' });
    }
});

module.exports = router;