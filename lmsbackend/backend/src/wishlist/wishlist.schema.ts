import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose,{Document, Types} from "mongoose";
import { user } from "src/users/users.schema";
import { Course } from "src/instructors/courses/course.schema";

export type WishlistDocument=Wishlist&Document

@Schema({timestamps:true})
export class Wishlist{

    


    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'user',required:true})
    user:user

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], default: [] })
    courses: Types.ObjectId[];
}

export const WishlistSchema=SchemaFactory.createForClass(Wishlist)