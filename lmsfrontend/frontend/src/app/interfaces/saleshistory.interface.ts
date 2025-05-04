interface Course {
  courseId: string;
  courseName?:string;
  amount: number;
  status: string;
  _id: string;
  cancellationDate?: string;
}

export interface SalesHistory {
  _id: string;
  orderId: string;
  student: {
    name: string;
    email: string;
  };
  courses: Course[];
  totalAmount: number;
  purchaseDate: string;
  status: string;
  cancellationReason?: string[];
}
