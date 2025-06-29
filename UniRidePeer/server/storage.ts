import { 
  users, 
  motorcycles, 
  bookings, 
  messages, 
  reviews, 
  otpCodes,
  type User, 
  type InsertUser,
  type Motorcycle,
  type InsertMotorcycle,
  type Booking,
  type InsertBooking,
  type Message,
  type InsertMessage,
  type Review,
  type InsertReview,
  type OtpCode,
  type InsertOtpCode
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  
  // OTP operations
  createOtpCode(otp: InsertOtpCode): Promise<OtpCode>;
  getValidOtpCode(phoneNumber: string, code: string): Promise<OtpCode | undefined>;
  markOtpAsUsed(id: number): Promise<void>;
  
  // Motorcycle operations
  createMotorcycle(motorcycle: InsertMotorcycle): Promise<Motorcycle>;
  getMotorcycleById(id: number): Promise<Motorcycle | undefined>;
  getMotorcyclesByOwner(ownerId: number): Promise<Motorcycle[]>;
  searchMotorcycles(filters: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
  }): Promise<Motorcycle[]>;
  updateMotorcycle(id: number, updates: Partial<InsertMotorcycle>): Promise<Motorcycle>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingsByBorrower(borrowerId: number): Promise<Booking[]>;
  getBookingsByOwner(ownerId: number): Promise<Booking[]>;
  updateBooking(id: number, updates: Partial<InsertBooking>): Promise<Booking>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number, bookingId?: number): Promise<Message[]>;
  markMessagesAsRead(userId: number, senderId: number): Promise<void>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  getReviewsForMotorcycle(motorcycleId: number): Promise<Review[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber));
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // OTP operations
  async createOtpCode(otpData: InsertOtpCode): Promise<OtpCode> {
    const [otp] = await db.insert(otpCodes).values(otpData).returning();
    return otp;
  }

  async getValidOtpCode(phoneNumber: string, code: string): Promise<OtpCode | undefined> {
    const [otp] = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.phoneNumber, phoneNumber),
          eq(otpCodes.code, code),
          eq(otpCodes.isUsed, false),
          gte(otpCodes.expiresAt, new Date())
        )
      );
    return otp;
  }

  async markOtpAsUsed(id: number): Promise<void> {
    await db.update(otpCodes).set({ isUsed: true }).where(eq(otpCodes.id, id));
  }

  // Motorcycle operations
  async createMotorcycle(motorcycleData: InsertMotorcycle): Promise<Motorcycle> {
    const [motorcycle] = await db.insert(motorcycles).values(motorcycleData).returning();
    return motorcycle;
  }

  async getMotorcycleById(id: number): Promise<Motorcycle | undefined> {
    const [motorcycle] = await db.select().from(motorcycles).where(eq(motorcycles.id, id));
    return motorcycle;
  }

  async getMotorcyclesByOwner(ownerId: number): Promise<Motorcycle[]> {
    return await db.select().from(motorcycles).where(eq(motorcycles.ownerId, ownerId));
  }

  async searchMotorcycles(filters: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
  }): Promise<Motorcycle[]> {
    const conditions = [];
    
    if (filters.isAvailable !== undefined) {
      conditions.push(eq(motorcycles.isAvailable, filters.isAvailable));
    }
    
    if (filters.type) {
      conditions.push(eq(motorcycles.type, filters.type));
    }
    
    if (filters.minPrice) {
      conditions.push(gte(motorcycles.hourlyRate, filters.minPrice.toString()));
    }
    
    if (filters.maxPrice) {
      conditions.push(lte(motorcycles.hourlyRate, filters.maxPrice.toString()));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(motorcycles).where(and(...conditions)).orderBy(asc(motorcycles.createdAt));
    }
    
    return await db.select().from(motorcycles).orderBy(asc(motorcycles.createdAt));
  }

  async updateMotorcycle(id: number, updates: Partial<InsertMotorcycle>): Promise<Motorcycle> {
    const [motorcycle] = await db
      .update(motorcycles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(motorcycles.id, id))
      .returning();
    return motorcycle;
  }

  // Booking operations
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(bookingData).returning();
    return booking;
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByBorrower(borrowerId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.borrowerId, borrowerId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBookingsByOwner(ownerId: number): Promise<Booking[]> {
    return await db
      .select({
        id: bookings.id,
        borrowerId: bookings.borrowerId,
        motorcycleId: bookings.motorcycleId,
        startDateTime: bookings.startDateTime,
        endDateTime: bookings.endDateTime,
        totalAmount: bookings.totalAmount,
        status: bookings.status,
        paymentMethod: bookings.paymentMethod,
        paymentStatus: bookings.paymentStatus,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
      })
      .from(bookings)
      .innerJoin(motorcycles, eq(bookings.motorcycleId, motorcycles.id))
      .where(eq(motorcycles.ownerId, ownerId))
      .orderBy(desc(bookings.createdAt));
  }

  async updateBooking(id: number, updates: Partial<InsertBooking>): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Message operations
  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(messageData).returning();
    return message;
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number, bookingId?: number): Promise<Message[]> {
    let query = db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
          and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
        )
      );
    
    if (bookingId) {
      query = query.where(eq(messages.bookingId, bookingId));
    }
    
    return await query.orderBy(asc(messages.createdAt));
  }

  async markMessagesAsRead(userId: number, senderId: number): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(
          eq(messages.receiverId, userId),
          eq(messages.senderId, senderId),
          eq(messages.isRead, false)
        )
      );
  }

  // Review operations
  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.revieweeId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsForMotorcycle(motorcycleId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .innerJoin(bookings, eq(reviews.bookingId, bookings.id))
      .where(eq(bookings.motorcycleId, motorcycleId))
      .orderBy(desc(reviews.createdAt));
  }
}

export const storage = new DatabaseStorage();
