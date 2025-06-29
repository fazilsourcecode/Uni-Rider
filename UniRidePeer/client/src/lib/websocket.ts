import { Message } from '@/types';

class WebSocketManager {
  private ws: WebSocket | null = null;
  private userId: number | null = null;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private reconnectInterval: number = 5000;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  connect(userId: number) {
    this.userId = userId;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Authenticate with server
      this.ws?.send(JSON.stringify({
        type: 'auth',
        userId: this.userId
      }));
    };
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message') {
          this.messageCallbacks.forEach(callback => callback(data.message));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.userId) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(this.userId!);
      }, this.reconnectInterval);
    }
  }

  sendMessage(senderId: number, receiverId: number, content: string, bookingId?: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'message',
        senderId,
        receiverId,
        content,
        bookingId,
        messageType: 'text'
      }));
    } else {
      console.error('WebSocket not connected');
    }
  }

  onMessage(callback: (message: Message) => void) {
    this.messageCallbacks.push(callback);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.userId = null;
    this.messageCallbacks = [];
  }
}

export const wsManager = new WebSocketManager();
