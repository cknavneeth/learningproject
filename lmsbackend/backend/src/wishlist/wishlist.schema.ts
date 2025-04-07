import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose,{Document} from "mongoose";
import { user } from "src/users/users.schema";
import { Course } from "src/instructors/courses/course.schema";

export type wishlistDocument=Wishlist&Document

@Schema({timestamps:true})
export class Wishlist{
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'user',required:true})
    user:user

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'Course.name'})
    courses:Course[]
}

export const WishlistSchema=SchemaFactory.createForClass(Wishlist)