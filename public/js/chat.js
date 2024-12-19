class ChatUI {
    constructor() {
        this.sessionId = localStorage.getItem('chatSessionId');
        this.chatContainer = document.getElementById('chat-container');
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        try {
            this.addMessage(message, 'user-message');
            this.messageInput.value = '';
            this.toggleLoading(true);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    message,
                    sessionId: this.sessionId 
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (data.sessionId && !this.sessionId) {
                this.sessionId = data.sessionId;
                localStorage.setItem('chatSessionId', this.sessionId);
            }

            this.addMessage(data.response, 'bot-message');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('Error al procesar tu mensaje', 'error-message');
        } finally {
            this.toggleLoading(false);
        }
    }

    addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        messageDiv.textContent = text;
        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    toggleLoading(show) {
        this.loadingIndicator.style.display = show ? 'block' : 'none';
        this.sendButton.disabled = show;
    }
}

// Inicializar el chat cuando se carga la página
window.addEventListener('DOMContentLoaded', () => {
    new ChatUI();
});