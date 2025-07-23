// src/users/interfaces/user-service.interface.ts

import { user, userDocument } from '../users.schema';
import { CourseResponse } from '../repositories/user/user.repository';

export interface IUsersService {
  findByEmail(email: string): Promise<userDocument | null>;
  createUser(username: string, email: string, password: string): Promise<user | null>;
  updateUser(email: string, updatedData: Partial<user>): Promise<void>;
  comparePassword(receivedPassword: string, storedHashedPassword: string): Promise<boolean>;
  findById(user: string): Promise<userDocument | null>;
  updatepassword(userId: string, hashedpassword: string): Promise<void>;
  createGoogleUser(name: string, email: string, password: string, googleId: string): Promise<userDocument | null>;
  getProfile(userId: string): Promise<Omit<user, 'password'>>;
  updateProfile(userId: string, profileData: Partial<user>): Promise<{ message: string; userProfile: Omit<user, 'password'> }>;
  updateStudentPassword(userId: string, passwordData: { currentPassword: string; newPassword: string }): Promise<{ message: string }>;
  getAllPublishedCourses(filters: {
    minPrice?: number;
    maxPrice?: number;
    languages?: string[];
    categories?: string[];
    page?: number;
    limit?: number;
    searchTerm?: string;
  }): Promise<CourseResponse>;
  getCourseById(courseId: string): Promise<any>;
  getWalletBalance(userId: string): Promise<{ wallet: number }>;
  getRecentTransactions(userId: string, limit?: number): Promise<any[]>;
}
