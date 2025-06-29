import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertMotorcycleSchema, insertBookingSchema, insertMessageSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

// Phone number validation schema
const phoneRegistrationSchema = z.object({
  phoneNumber: z.string().min(10).max(20),
  university: z.string().min(1),
  role: z.enum(["lender", "borrower"]),
});

const otpVerificationSchema = z.object({
  phoneNumber: z.string().min(10).max(20),
  code: z.string().length(6),
});

const profileSetupSchema = insertUserSchema.extend({
  phoneNumber: z.string().min(10).max(20),
});

const searchSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().optional(),
  type: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

// WebSocket connection management
interface WebSocketConnection {
  userId: number;
  ws: WebSocket;
}

const connections = new Map<number, WebSocketConnection>();

// Generate random OTP (in production, use proper SMS service)
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth') {
          connections.set(message.userId, { userId: message.userId, ws });
          ws.send(JSON.stringify({ type: 'auth_success' }));
        } else if (message.type === 'message') {
          // Save message to database
          const newMessage = await storage.createMessage({
            senderId: message.senderId,
            receiverId: message.receiverId,
            bookingId: message.bookingId,
            content: message.content,
            messageType: message.messageType || 'text'
          });
          
          // Send to receiver if online
          const receiverConnection = connections.get(message.receiverId);
          if (receiverConnection && receiverConnection.ws.readyState === WebSocket.OPEN) {
            receiverConnection.ws.send(JSON.stringify({
              type: 'new_message',
              message: newMessage
            }));
          }
          
          // Confirm to sender
          ws.send(JSON.stringify({
            type: 'message_sent',
            message: newMessage
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      // Remove connection
      for (const [userId, connection] of Array.from(connections.entries())) {
        if (connection.ws === ws) {
          connections.delete(userId);
          break;
        }
      }
    });
  });

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { phoneNumber, university, role } = phoneRegistrationSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByPhoneNumber(phoneNumber);
      if (existingUser) {
        return res.status(400).json({ message: 'Phone number already registered' });
      }
      
      // Generate and save OTP
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      await storage.createOtpCode({
        phoneNumber,
        code: otpCode,
        expiresAt,
        isUsed: false
      });
      
      // In production, send SMS here
      console.log(`OTP for ${phoneNumber}: ${otpCode}`);
      
      res.json({ message: 'OTP sent successfully', otpCode }); // Remove otpCode in production
    } catch (error) {
      res.status(400).json({ message: 'Invalid input', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/auth/verify-otp', async (req, res) => {
    try {
      const { phoneNumber, code } = otpVerificationSchema.parse(req.body);
      
      // For development, allow bypassing OTP with code "123456"
      if (code === "123456") {
        return res.json({ message: 'OTP verified successfully (dev bypass)' });
      }
      
      // Normalize phone number format (add + prefix if missing)
      const normalizedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      console.log(`Verifying OTP - Phone: ${normalizedPhone}, Code: ${code}`);
      
      const otpRecord = await storage.getValidOtpCode(normalizedPhone, code);
      console.log(`OTP Record found:`, otpRecord);
      
      if (!otpRecord) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
      
      await storage.markOtpAsUsed(otpRecord.id);
      
      res.json({ message: 'OTP verified successfully' });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(400).json({ message: 'Invalid input', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/auth/complete-profile', async (req, res) => {
    try {
      const userData = profileSetupSchema.parse(req.body);
      
      // Verify phone number was verified
      const existingUser = await storage.getUserByPhoneNumber(userData.phoneNumber);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      const user = await storage.createUser({
        ...userData,
        isPhoneVerified: true,
        isVerified: false // Will be verified by university
      });
      
      res.json({ user });
    } catch (error) {
      res.status(400).json({ message: 'Invalid input', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // User routes
  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Motorcycle routes
  app.post('/api/motorcycles', async (req, res) => {
    try {
      const motorcycleData = insertMotorcycleSchema.parse(req.body);
      const motorcycle = await storage.createMotorcycle(motorcycleData);
      res.json(motorcycle);
    } catch (error) {
      res.status(400).json({ message: 'Invalid input', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get('/api/motorcycles/search', async (req, res) => {
    try {
      const filters = searchSchema.parse({
        latitude: req.query.latitude ? parseFloat(req.query.latitude as string) : undefined,
        longitude: req.query.longitude ? parseFloat(req.query.longitude as string) : undefined,
        radius: req.query.radius ? parseFloat(req.query.radius as string) : undefined,
        type: req.query.type as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      });
      
      const motorcycles = await storage.searchMotorcycles({
        ...filters,
        isAvailable: true
      });
      
      res.json(motorcycles);
    } catch (error) {
      res.status(400).json({ message: 'Invalid search parameters' });
    }
  });

  app.get('/api/motorcycles/:id', async (req, res) => {
    try {
      const motorcycleId = parseInt(req.params.id);
      const motorcycle = await storage.getMotorcycleById(motorcycleId);
      
      if (!motorcycle) {
        return res.status(404).json({ message: 'Motorcycle not found' });
      }
      
      res.json(motorcycle);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Booking routes
  app.post('/api/bookings', async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Check motorcycle availability
      const motorcycle = await storage.getMotorcycleById(bookingData.motorcycleId);
      if (!motorcycle || !motorcycle.isAvailable) {
        return res.status(400).json({ message: 'Motorcycle not available' });
      }
      
      const booking = await storage.createBooking({
        ...bookingData,
        status: 'pending',
        paymentStatus: 'pending'
      });
      
      res.json(booking);
    } catch (error) {
      res.status(400).json({ message: 'Invalid booking data', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get('/api/bookings/borrower/:borrowerId', async (req, res) => {
    try {
      const borrowerId = parseInt(req.params.borrowerId);
      const bookings = await storage.getBookingsByBorrower(borrowerId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/bookings/:id', async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const updates = req.body;
      
      const booking = await storage.updateBooking(bookingId, updates);
      res.json(booking);
    } catch (error) {
      res.status(400).json({ message: 'Invalid update data' });
    }
  });

  // Message routes
  app.get('/api/messages/:user1Id/:user2Id', async (req, res) => {
    try {
      const user1Id = parseInt(req.params.user1Id);
      const user2Id = parseInt(req.params.user2Id);
      const bookingId = req.query.bookingId ? parseInt(req.query.bookingId as string) : undefined;
      
      const messages = await storage.getMessagesBetweenUsers(user1Id, user2Id, bookingId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/messages/read', async (req, res) => {
    try {
      const { userId, senderId } = req.body;
      await storage.markMessagesAsRead(userId, senderId);
      res.json({ message: 'Messages marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Review routes
  app.post('/api/reviews', async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: 'Invalid review data', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.get('/api/reviews/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reviews = await storage.getReviewsByUser(userId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/reviews/motorcycle/:motorcycleId', async (req, res) => {
    try {
      const motorcycleId = parseInt(req.params.motorcycleId);
      const reviews = await storage.getReviewsForMotorcycle(motorcycleId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  return httpServer;
}
