// export interface ProfileResponse {
//   username: string;
//   email: string;
//   phone?: string;
//   bio?: string;
// }

export interface Profile{
   message:string
   profile:ProfileResponse
}

// src/app/interfaces/userprofile.interface.ts

// Define nested interfaces first
export enum FrontendUserRole {
  STUDENT = 'student'
}

export enum FrontendTransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit'
}

export interface FrontendWalletTransaction {
  type: FrontendTransactionType;
  amount: number;
  date: Date | string; 
  description?: string;
}

export interface UserProfile { 
  _id?: string;
  username: string;
  email: string;
  isVerified: boolean;
  otp?: string | null;
  otpExpires?: Date | string | null; 
  isBlocked: boolean;
  role: FrontendUserRole;
  googleId?: string;
  isGoogleUser: boolean;
  phone?: string;
  bio?: string;
  wallet: number;
  transactions: FrontendWalletTransaction[];
  createdAt?: Date | string; 
  updatedAt?: Date | string; 
}

export interface ProfileResponse {
  status: string; 
  message?: string;
  userProfile?: UserProfile; 
}