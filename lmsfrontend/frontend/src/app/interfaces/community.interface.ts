export interface IMessage {
  _id: string;
  senderId: string;
  username: string;
  content: string;
  type: 'text' | 'image';
  isDeleted: boolean;
  createdAt: string; 
  communityId: string;
}


export interface ICommunity {
  _id: string;
  courseId: string;
  instructorId: string;
  userLastReadCounts: Record<string, number>;
}


export interface IJoinRoomResponse {
  success: boolean;
  messages?: IMessage[];
  isInstructor?: boolean;
  userId?: string;
  message?: string; // optional error message
}

export interface IMessageDeleted {
  messageId: string;
  courseId: string;
}

export interface IUnreadCountsResponse {
  success: boolean;
  unreadCounts?: Record<string, number>;
}

