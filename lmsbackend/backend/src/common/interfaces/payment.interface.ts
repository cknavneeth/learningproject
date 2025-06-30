import { ObjectId, Types } from "mongoose";

export interface ICoursePurchase{
    userId:Types.ObjectId,
    courseId:Types.ObjectId,
    paymentId:Types.ObjectId,
    purchasedDate:Date
}