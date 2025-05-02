import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types,Document } from 'mongoose';


export type MessageDocument=Message & Document

export type CommunityDocument=Community & Document


@Schema({timestamps:true})
export class Message{

    @Prop({type:Types.ObjectId,required:true})
    senderId:Types.ObjectId

    @Prop({required:true})
    username:string

    @Prop({required:true})
    content:string

    @Prop({default:'text',enum:['text','image']})
    type:string

    @Prop({default:false})
    isDeleted:boolean

    @Prop({default:Date.now})
    createdAt:Date


    @Prop({type:Types.ObjectId,required:true,ref:'Community'})
    communityId:Types.ObjectId
}

export const MessageSchema=SchemaFactory.createForClass(Message)

@Schema({timestamps:true})
export class Community{
    @Prop({type:Types.ObjectId,required:true,unique:true,ref:'Course'})
    courseId:Types.ObjectId


    @Prop({type:Types.ObjectId,required:true,ref:'instructor'})
    instructorId:Types.ObjectId

}

export const CommunitySchema=SchemaFactory.createForClass(Community)