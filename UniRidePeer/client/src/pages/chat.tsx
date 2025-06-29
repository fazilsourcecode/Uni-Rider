import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/use-websocket";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Phone, Plus, Send } from "lucide-react";
import { Message } from "@/types";

export default function Chat() {
  const { userId, bookingId } = useParams();
  const [, setLocation] = useLocation();
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const otherUserId = parseInt(userId as string);
  
  const { isConnected, sendMessage } = useWebSocket(currentUser.id);

  const { data: messages, isLoading } = useQuery({
    queryKey: [`/api/messages/${currentUser.id}/${otherUserId}`, bookingId],
    enabled: !!currentUser.id && !!otherUserId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/messages", {
        senderId: currentUser.id,
        receiverId: otherUserId,
        content,
        bookingId: bookingId ? parseInt(bookingId) : undefined,
        messageType: 'text'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [`/api/messages/${currentUser.id}/${otherUserId}`] 
      });
    },
  });

  // Mock data for demonstration
  const mockMessages: Message[] = [
    {
      id: 1,
      senderId: otherUserId,
      receiverId: currentUser.id,
      content: "Hi! Thanks for your interest in my Honda CBR. It's available for the time you requested.",
      messageType: 'text',
      isRead: true,
      createdAt: "2024-01-15T14:30:00Z",
    },
    {
      id: 2,
      senderId: currentUser.id,
      receiverId: otherUserId,
      content: "Great! Is it easy to ride? I'm relatively new to motorcycles.",
      messageType: 'text',
      isRead: true,
      createdAt: "2024-01-15T14:32:00Z",
    },
    {
      id: 3,
      senderId: otherUserId,
      receiverId: currentUser.id,
      content: "Absolutely! It's very beginner-friendly. I can give you a quick tutorial before you ride if needed.",
      messageType: 'text',
      isRead: true,
      createdAt: "2024-01-15T14:33:00Z",
    },
    {
      id: 4,
      senderId: currentUser.id,
      receiverId: otherUserId,
      content: "Perfect! See you tomorrow at the Engineering Building parking. Thanks!",
      messageType: 'text',
      isRead: true,
      createdAt: "2024-01-15T14:35:00Z",
    },
  ];

  const mockOtherUser = {
    id: otherUserId,
    name: "Mike Johnson",
    role: "Honda CBR Owner",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
  };

  const displayMessages = messages || mockMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  const handleSendMessage = () => {
    if (messageText.trim() && currentUser.id) {
      if (isConnected) {
        sendMessage(otherUserId, messageText.trim(), bookingId ? parseInt(bookingId) : undefined);
      } else {
        sendMessageMutation.mutate(messageText.trim());
      }
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col fade-in">
      {/* Chat Header */}
      <div className="bg-white shadow-sm p-4 pt-12">
        <div className="flex items-center">
          <button onClick={() => setLocation('/dashboard')} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center flex-1">
            <img 
              src={mockOtherUser.profileImage}
              alt={mockOtherUser.name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{mockOtherUser.name}</h3>
              <p className="text-sm text-gray-600">{mockOtherUser.role}</p>
            </div>
          </div>
          <button className="text-gray-600 hover:text-gray-800">
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {displayMessages.map((message) => (
          <div key={message.id} className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'items-start'}`}>
            {message.senderId !== currentUser.id && (
              <img 
                src={mockOtherUser.profileImage}
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover mr-3 mt-2"
              />
            )}
            <div className={`flex-1 ${message.senderId === currentUser.id ? 'flex justify-end' : ''}`}>
              <div className={`rounded-lg p-3 max-w-xs ${
                message.senderId === currentUser.id 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white shadow-sm rounded-tl-none'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* System Message */}
        <div className="flex justify-center">
          <div className="bg-gray-200 rounded-full px-4 py-2">
            <p className="text-xs text-gray-600">
              You booked this motorcycle for tomorrow 2:00 PM
            </p>
          </div>
        </div>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button className="text-gray-400 hover:text-gray-600">
            <Plus className="w-5 h-5" />
          </button>
          <Input
            type="text"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 rounded-full px-4 py-2 focus:outline-none focus:border-primary"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
            className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
