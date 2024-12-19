// services/dbService.js
const mysql = require('mysql2/promise');
const config = require('../config');

class DbService {
    constructor() {
        this.pool = mysql.createPool(config.DB);
    }

    async createSession(sessionId) {
        try {
            const [result] = await this.pool.execute(
                'INSERT INTO sessions (id) VALUES (?)',
                [sessionId]
            );
            return result;
        } catch (error) {
            console.error('Error creando sesión:', error);
            throw error;
        }
    }

    async saveMessage(sessionId, content, isUser) {
        try {
            // Verificar si la sesión existe, si no, crearla
            const [sessions] = await this.pool.execute(
                'SELECT id FROM sessions WHERE id = ?',
                [sessionId]
            );

            if (sessions.length === 0) {
                await this.createSession(sessionId);
            }

            const [result] = await this.pool.execute(
                'INSERT INTO messages (session_id, content, is_user) VALUES (?, ?, ?)',
                [sessionId, content, isUser]
            );

            return result;
        } catch (error) {
            console.error('Error guardando mensaje:', error);
            throw error;
        }
    }

    async getChatHistory(sessionId) {
        try {
            const [messages] = await this.pool.execute(
                `SELECT content, is_user, timestamp 
                 FROM messages 
                 WHERE session_id = ? 
                 ORDER BY timestamp ASC`,
                [sessionId]
            );
            return messages;
        } catch (error) {
            console.error('Error obteniendo historial:', error);
            throw error;
        }
    }

    async deleteSession(sessionId) {
        try {
            await this.pool.execute(
                'DELETE FROM messages WHERE session_id = ?',
                [sessionId]
            );
            await this.pool.execute(
                'DELETE FROM sessions WHERE id = ?',
                [sessionId]
            );
        } catch (error) {
            console.error('Error eliminando sesión:', error);
            throw error;
        }
    }
}

module.exports = new DbService();