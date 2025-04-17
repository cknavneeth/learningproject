import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseProgressDocument=CourseProgress & Document

@Schema({timestamps:true})
export class CourseProgress{
        @Prop({type:Types.ObjectId,ref:'User',required:true})
        userId:Types.ObjectId

        @Prop({type:Types.ObjectId,ref:'Course' ,required:true})
        courseId:Types.ObjectId

        @Prop({type:Number,default:0})
        overallProgress:number;

        @Prop({type:Map,of:Number,default:new Map()})
        sectionProgress:Map<string,number>

        @Prop({ type: String })
        currentSection: string;

        @Prop({ type: Map, of: Number, default: new Map() })
        videoTimestamps: Map<string, number>;

        @Prop({ type: [String], default: [] })
        completedSections: string[];
}

export const CourseProgressSchema=SchemaFactory.createForClass(CourseProgress)