import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Course, CourseDocument, CourseStatus } from 'src/instructors/courses/course.schema';
import { IAdminRepository } from '../admin.repository.interface';
import { Payment, PaymentDocument } from 'src/payment/schema/payment.schema';


interface AggregatedSale {
    _id: Types.ObjectId;
    orderId: string;
    status: string;
    amount: number;
    createdAt:Date
    purchaseDate: Date;
    coursesDetails: {
        courseId: Types.ObjectId;
        amount: number;
        status: string;
        cancellationReason?: string;
        cancellationDate?: Date;
        cancellationStatus?: string;
    }[];
    student: {
        username: string;
        email: string;
    };
}

@Injectable()
export class AdminRepository implements IAdminRepository{

    constructor(@InjectModel(Course.name) private courseModel:Model<CourseDocument>, 
                @InjectModel(Payment.name) private paymentModel:Model<PaymentDocument>
         ){}

    async getAllCourses(page:number=1,limit:number=10):Promise<{courses:CourseDocument[],total:number}> {
        const skip=(page-1)*limit

        const [courses,total]=await Promise.all([
            this.courseModel.find()
            .populate('instructor','name email isApproved')
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .exec(),
            this.courseModel.countDocuments().exec()
        ])
        return { courses, total };
    }

    async updateCourseStatus(courseId:string,isApproved:boolean,feedback?:string):Promise<CourseDocument|null>{
        if(!Types.ObjectId.isValid(courseId)){
            throw new NotFoundException('invalid course id')
        }

        const course=await this.courseModel.findById(courseId)
        if(!course){
            throw new NotFoundException('course not found')
        }
        if(course.status!==CourseStatus.PENDING_REVIEW){
            throw new NotFoundException('course is not pending review')
        }

        const updates:any={
            status:isApproved?CourseStatus.PUBLISHED:CourseStatus.REJECTED,
            feedback:feedback,
            updatedAt:new Date()
        }

        if(!isApproved&&feedback){
            updates.rejectionFeedback=feedback
            updates.rejectedAt=new Date()
        }

        const updateCourse=await this.courseModel.findByIdAndUpdate(courseId,{$set:updates},{new:true}).populate('instructor').exec()

        if(!updateCourse){
            throw new NotFoundException('Failed to update course')
        }
        return updateCourse
    }



    //adding offer
    async addCourseOffer(courseId:string,offerData:{percentage:number;discountPrice:number}):Promise<CourseDocument|null>{
          if(!Types.ObjectId.isValid(courseId)){
            throw new BadRequestException('Invalid course id')
          }

          return this.courseModel.findByIdAndUpdate(
            courseId,
            {
                $set:{
                    offer:{
                        ...offerData,
                        createdAt:new Date()
                    }
                }
            },
            {new :true}
          )
          .populate('instructor')
          .exec()
    }


    async getCourseById(courseId: string): Promise<CourseDocument | null> {
        if(!Types.ObjectId.isValid(courseId)){
            throw new BadRequestException('invalid course id')
        }

        const course=await this.courseModel.findById(courseId)

        if(!course){
            throw new NotFoundException('Course not found')
        }

        return course
    }



    async removeCourseOffer(courseId:string):Promise<CourseDocument|null>{
        if(!Types.ObjectId.isValid(courseId)){
            throw new BadRequestException('invalid course id')
        }

        return this.courseModel.findByIdAndUpdate(
            courseId,
            {
                $unset:{offer:''}
            },
            {new :true}
        )
        .populate('instructor')
        .exec()
    }



    //for getting sales history
    async getSalesHistory(page:number=1,limit:number=10):Promise<{sales:AggregatedSale[],total:number}>{
        console.log('getting sales history')
        const skip=(page-1)*limit

        const mostRecent = await this.paymentModel.findOne({ status: 'completed' })
        .sort({ createdAt: -1 })
        .lean();
    console.log('Most recent payment in DB:', mostRecent);

        const pipeline=[
            {
                $match: {
                    status: { $in: ['completed'] }, 
                    userId: { $exists: true },
                    coursesDetails: { $exists: true, $ne: [] }
                }
            },
            {
                $lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    as:'userDetails'
                }
            },
            {
                $unwind:{
                    path:'$userDetails',
                    preserveNullAndEmptyArrays:false
                }
            },
            {
                $unwind:{
                    path:'$coursesDetails',
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $lookup:{
                    from:'courses',
                    localField:'coursesDetails.courseId',
                    foreignField:'_id',
                    as:'courseInfo'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    orderId: { $first: '$orderId' },
                    status: { $first: '$status' },
                    amount: { $first: '$amount' },
                    createdAt: { $first: '$createdAt' },
                    purchaseDate: { $first: '$createdAt' },
                    coursesDetails: { 
                        $push: {
                            $mergeObjects: [
                                '$coursesDetails',
                                { courseInfo: { $arrayElemAt: ['$courseInfo', 0] } }
                            ]
                        }
                    },
                    userDetails: { $first: '$userDetails' }
                }
            },
            {
                $sort:{createdAt:-1}
            },
            {
                $project:{
                    _id:1,
                    orderId:1,
                    status:1,
                    amount:1,
                    createdAt:1,
                    purchaseDate:1,
                    coursesDetails:1,
                    student:{
                        username:'$userDetails.username',
                        email:'$userDetails.email'
                    }
                }
            },
            {
                $skip:skip
            },
            {
                $limit:limit
            }
        ]

        const [sales,totalCount]=await Promise.all([
           this.paymentModel.aggregate<AggregatedSale>(pipeline as PipelineStage[]),
           this.paymentModel.countDocuments()
        ])
        console.log('sales',sales)
        console.log('total',totalCount)
        return {sales,total:totalCount}
    }



    async getOrderById(orderId:string):Promise<PaymentDocument|null>{
        return this.paymentModel.findOne({orderId})
        .populate('userId','name email')
        .populate('courses','title')
        .exec()
    }

    async updateOrderStatus(orderId:string,status:string):Promise<PaymentDocument|null>{
        const updatedStatus=await this.paymentModel.findOneAndUpdate(
            {orderId:orderId},
            {$set:{status}},
            {new:true}
        )
        .populate('userId','name email')
        .populate('courses','title')
        .exec()

        return updatedStatus
    }




}
