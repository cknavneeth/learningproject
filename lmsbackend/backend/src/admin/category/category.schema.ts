import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

   
export type CategoryDocument=Category & Document

@Schema({timestamps:true})
export class Category{
    @Prop({required:true,unique:true})
    name:string;

    @Prop({required:true})
    description:string;

    @Prop({default:false})
    isDeleted:boolean;

    @Prop({default:false})
    isListed:boolean;

    @Prop({default:false})
    createdAt:Date;

    @Prop({default:false})
    updatedAt:Date;

}

export const CategorySchema=SchemaFactory.createForClass(Category)