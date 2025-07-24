// export interface CartItem{
//     _id:string;
//     courseId: {
//     _id: string;
//     title: string;
//     price: number;
//     thumbnail?: string;
//     instructor?: {
//       _id: string;
//       name: string;
//     };
//     rating?: number;
//     language?: string;
//     level?: string;
//     category?: string;
//   };
// }

export interface Cart{
    _id:string;
    userId:string;
    items:CartItem[];
    
    createdAt:string,
    updatedAt:string
}

export interface CartResponse{
    _id:string;
    userId:string;
    items:CartItem[];
    totalAmount:number
    createdAt:string,
    updatedAt:string
}









// cart.interface.ts

export interface Offer {
  discountPrice: number;
  percentage: number;
}

export interface Instructor {
  name: string;
}

export interface Course {
  _id: string;
  title: string;
  price: number;
  thumbnailUrl: string;
  offer: Offer;
  instructor: Instructor;
}

export interface CartItem {
  courseId: Course;
}

export interface CartResponse {
  _id: string;
  userId: string;
  items: CartItem[];
}
