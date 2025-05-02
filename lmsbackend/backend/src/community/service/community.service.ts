import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Community, CommunityDocument, Message, MessageDocument } from '../schema/community.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { ICommunityService } from './interfaces/community.service.interface';
import { Course, CourseDocument } from 'src/instructors/courses/course.schema';

@Injectable()
export class CommunityService implements ICommunityService{
    private readonly logger=new Logger(CommunityService.name)

    constructor(
        @InjectModel(Community.name) private communityModel:Model<CommunityDocument>,
        @InjectModel(Message.name) private messageModel:Model<MessageDocument>,
        @InjectModel(Course.name) private courseModel:Model<CourseDocument>,
        private readonly cloudinaryService:CloudinaryService
    ){}


    async getCommunity(courseId:string):Promise<CommunityDocument>{
        this.logger.log(`Getting community for course: ${courseId}`)

        let community=await this.communityModel.findOne({courseId:new Types.ObjectId(courseId)})

        if(!community){
            const course=await this.courseModel.findById(courseId)
            if(!course){
                throw new NotFoundException('Course not found')
            }
            community=new this.communityModel({
                courseId:new Types.ObjectId(courseId),
                instructorId:course.instructor
            })
            await community.save()
        }

        return community  
    }


    async getMessages(courseId:string,limit:number=50,before?:Date):Promise<MessageDocument[]>{
        const community=await this.getCommunity(courseId)

        const query:any={
            communityId:community._id,
            isDeleted:false
        }

        if(before){
            query.createdAt={$lt:before}
        }

        return this.messageModel.find(query)
        .sort({createdAt:-1})
        .limit(limit)
        .exec()
        .then(messages=>messages.reverse())

    }
    

    async addTextMessage(courseId:string,userId:string,username:string,content:string):Promise<MessageDocument>{
        this.logger.log(`Adding text message to course: ${courseId}`)

        const community=await this.getCommunity(courseId)

        const message=new this.messageModel({
            senderId:new Types.ObjectId(userId),
            username,
            content,
            type:'text',
            isDeleted:false,
            communityId:community._id
        })
        return message.save()
    }


    async deleteMessage(courseId:string,messageId: string, userId: string): Promise<boolean> {
        this.logger.log(`Deleting message ${messageId}`);
        
        const message = await this.messageModel.findById(messageId);
        
        if (!message) {
          throw new NotFoundException('Message not found');
        }
        
        // Check if the user is the message owner
        if (message.senderId.toString() !== userId) {
          return false;
        }
        
        // Soft delete - mark as deleted
        message.isDeleted = true;
        await message.save();
        
        return true;
      }


      async getMessageCount(courseId: string): Promise<number> {
        const community = await this.getCommunity(courseId);
        
        return this.messageModel.countDocuments({
          communityId: community._id,
          isDeleted: false
        });
      }



      async getMessagesBefore(courseId: string, timestamp: Date, limit: number = 50): Promise<MessageDocument[]> {
        const community = await this.getCommunity(courseId);
        
        return this.messageModel.find({
          communityId: community._id,
          isDeleted: false,
          createdAt: { $lt: timestamp }
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec()
        .then(messages => messages.reverse());
      }


      async addImageMessage(courseId:string,userId:string,username:string,image:Buffer):Promise<MessageDocument>{
        this.logger.log(`Adding image message to course: ${courseId}`)


        const community=await this.getCommunity(courseId)

        try {
            const imageUrl=await this.cloudinaryService.UploadedFile({
                buffer:image,
                mimetype:'image/jpeg'
            } as Express.Multer.File)

            const message=new this.messageModel({
                senderId:new Types.ObjectId(userId),
                username,
                content:imageUrl,
                type:'image',
                isDeleted:false,
                communityId:community._id
            })

            return message.save()
        } catch (error) {
            this.logger.error(`Failed to upload image: ${error.message}`)
            throw error 
        }
      }
}
