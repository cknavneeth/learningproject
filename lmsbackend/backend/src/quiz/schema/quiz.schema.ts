import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types,Document } from 'mongoose';

export type QuizDocument=Quiz & Document

@Schema({timestamps:true})
export class Quiz{
    @Prop({type:Types.ObjectId,ref:'user'})
    userId:Types.ObjectId

    @Prop({required:true})
    topic:string

    @Prop({required:true})
    score:number

    @Prop({required:true})
    totalQuestions:number

    @Prop({required:true})
    correctAnswers:number

    @Prop({default:false})
    isSubmitted:boolean

    @Prop({type:[{
          question:String,
          options:[String],
          correctAnswer:Number,
          userAnswer:Number
    }] })
    questions:{
        question:string
        options:string[],
        correctAnswer:Number,
        userAnswer:number
    }[]
}

export const QuizSchema=SchemaFactory.createForClass(Quiz)