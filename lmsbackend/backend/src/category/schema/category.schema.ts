import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import {Document} from "mongoose"

        
export type CategoryDocument=Category & Document

@Schema({timestamps:true})
export class Category{
    @Prop({required:true,unique:true})
    name:string

    @Prop({required:true})
    description:string

    @Prop({required:true})
    imageUrl:string
}

export const CategorySchema=SchemaFactory.createForClass(Category)