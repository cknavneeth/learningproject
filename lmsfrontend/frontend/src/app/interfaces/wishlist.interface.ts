import { Course } from "./course.interface"

export interface Wishlist{
    _id:string
    user:string
    courses:Course[]
    createdAt:Date
    updatedAt:Date
}

export interface WishlistResponse{
    _id:string
    user:string
    courses:Course[]
    createdAt:string
    updatedAt:string
}