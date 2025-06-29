import { useEffect, useState } from 'react';
import { wsManager } from '@/lib/websocket';
import { Message } from '@/types';

export function useWebSocket(userId: number | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (userId) {
      wsManager.connect(userId);
      setIsConnected(true);

      wsManager.onMessage((message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      return () => {
        wsManager.disconnect();
        setIsConnected(false);
      };
    }
  }, [userId]);

  const sendMessage = (receiverId: number, content: string, bookingId?: number) => {
    if (userId) {
      wsManager.sendMessage(userId, receiverId, content, bookingId);
    }
  };

  return {
    isConnected,
    messages,
    sendMessage,
    clearMessages: () => setMessages([])
  };
}
