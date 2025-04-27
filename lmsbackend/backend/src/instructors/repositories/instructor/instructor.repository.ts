import { Injectable, NotFoundException } from '@nestjs/common';
import { IDashboardStats, IInstructorRepository } from '../instructor.repository.interface';
import { userDocument } from 'src/users/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { instructor, instructorDocument } from 'src/instructors/instructor.schema';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from 'src/instructors/courses/course.schema';
import { Payment, PaymentDocument } from 'src/payment/schema/payment.schema';

@Injectable()
export class InstructorRepository implements IInstructorRepository{

    constructor(@InjectModel(instructor.name) private instructorModel:Model<instructorDocument>,
                @InjectModel(Course.name) private courseModel:Model<CourseDocument>,
                @InjectModel(Payment.name) private paymentModel:Model<PaymentDocument>
    ){}

     async findById(instructorId:string):Promise<instructorDocument|null>{
      return await this.instructorModel.findById(instructorId)
    }

    async updateProfile(instructorId:string,profileData:Partial<instructor>):Promise<instructorDocument>{
        const instructor=await this.instructorModel.findByIdAndUpdate(instructorId,{$set:profileData},{new:true})
        if(!instructor){
            throw new Error('instructor not found')
        }
        return instructor
    }


    async updatePassword(instructorId:string,hashedpassword:string):Promise<void>{
        await this.instructorModel.findByIdAndUpdate(instructorId,{$set:{password:hashedpassword}}).exec()
    }


    async updateReapplyStatus(instructorId:string,canReapply:boolean):Promise<instructorDocument>{
        const instructor=await this.instructorModel.findByIdAndUpdate(instructorId,{
            $set:{
                canReapply:canReapply,
                isApproved:false,
                rejectionFeedback:null,
                rejectedAt:null
            }
        },{new:true})

        if(!instructor){
            throw new NotFoundException('instructor not found')
        }
        return instructor
    }


    //do dashboard for instructor
    async getDashboardStats(instructorId:string):Promise<IDashboardStats>{
        const instructorObjectId=new Types.ObjectId(instructorId)

        const currentYear=new Date().getFullYear()

        //get all courses by the instructor
        const courses=await this.courseModel.find({instructor:instructorObjectId})

        const courseIds=courses.map(course=>course._id)

        //Get monthly sales data

        const monthlyData=await this.paymentModel.aggregate([
            {
                $match:{
                    status:'completed',
                    'coursesDetails.courseId':{$in:courseIds},
                    createdAt:{
                        $gte:new Date(currentYear,0,1),
                        $lte:new Date(currentYear,11,31)
                    }
                }
            },
            {
                $unwind:'$coursesDetails'
            },
            {
                $match:{
                    'coursesDetails.courseId':{$in:courseIds}
                }
            },
            {
                $group:{
                    _id:{$month:'$createdAt'},
                    revenue:{$sum:'$coursesDetails.amount'},
                    purchases:{$sum:1}
                }
            },
            {
                $sort:{_id:1}
            }
        ])


        //we need monthly sales data right
        const monthlySalesData = Array.from({ length: 12 }, (_, i) => {
            const monthData = monthlyData.find(data => data._id === i + 1) || { revenue: 0, purchases: 0 };
            return {
                month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
                revenue: monthData.revenue || 0,
                purchases: monthData.purchases || 0
            };
        });


        //i also need totoal earnings and unique students
        const totalStats=await this.paymentModel.aggregate([
            {
                $match:{
                    status:'completed',
                    'coursesDetails.courseId':{$in:courseIds}
                }
            },
            {
                $unwind:'$coursesDetails'
            },
            {
                $match:{
                    'coursesDetails.courseId':{$in:courseIds}
                }
            },
            {
                $group:{
                    _id:null,
                    totalEarnings:{$sum:'$coursesDetails.amount'},
                    uniqueStudents:{$addToSet:'$userId'}
                }
            }
        ])


        return {
            totalCourses:courses.length,
            totalStudents:totalStats[0]?.uniqueStudents.length||0,
            totalEarnings:totalStats[0]?.totalEarnings||0,
            monthlySalesData
        }


    }

}
