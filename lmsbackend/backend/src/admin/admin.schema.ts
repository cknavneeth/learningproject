import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type admindocument=admin & Document

@Schema()
export class admin{
    @Prop({required:true,unique:true})
    email:string

    @Prop({required:true})
    password:string
}

export const adminSchema=SchemaFactory.createForClass(admin)