import { user,userDocument } from "src/users/users.schema";
import {Request, Response } from 'express';

export interface IAuthService{
     register(username: string, email: string, password: string): Promise<{ message: string }>;
  sendOtp(email: string): Promise<{ message: string }>;
  sendMail(email: string, otp: string): Promise<void>;
  verifyotp(email: string, otp: string): Promise<{ message: string }>;
  login(email: string, password: string, res: Response): Promise<{ accesstoken: string; refreshtoken: string; message: string }>;
  generateAccessToken(user: user | userDocument): string;
  generateRefreshToken(user: user | userDocument): string;
  setAccessToken(token: string): void;
  getAccessToken(): string | null;
  refreshaccesstoken(refreshtoken: string): Promise<string>;
  forgotpassword(email: string): Promise<{ message: string }>;
  resetPasswordStudent(token: string, password: string): Promise<{ message: string }>;
  handleGoogleSignIn(credential: string, res: Response): Promise<Response>;
}