import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import {Document, Types} from "mongoose"

        
export type CategoryDocument=Category & Document

@Schema({timestamps:true})
export class Category{
 
    _id?:Types.ObjectId

    @Prop({required:true,unique:true})
    name:string

    @Prop({required:true})
    description:string

}

export const CategorySchema=SchemaFactory.createForClass(Category)