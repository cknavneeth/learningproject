export interface InstructorProfile {
  _id: string;
  name: string;
  emailaddress: string;
  phone?:string
  bio?: string;
  expertise?: string[];
  qualification?: string;
  experience?: number;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  profilePicture?: string;
  isVerified: boolean;
  isApproved: boolean;
  isBlocked: boolean;
  certificateUrl: string;
  rejectionFeedback?: string;
  canReapply: boolean;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileUpdateRequest {
  username?: string;
  bio?: string;
  phone?:string
  expertise?: string[];
  qualification?: string;
  experience?: number;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  profilePicture?: string;
}


export interface PasswordUpdateRequest {
  currentPassword?: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}


