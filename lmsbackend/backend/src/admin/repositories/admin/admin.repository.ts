import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Course, CourseDocument, CourseStatus } from 'src/instructors/courses/course.schema';
import { IAdminRepository } from '../admin.repository.interface';
import { Payment, PaymentDocument } from 'src/payment/schema/payment.schema';
import { user, userDocument } from 'src/users/users.schema';
import { instructor, instructorDocument } from 'src/instructors/instructor.schema';


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
                @InjectModel(Payment.name) private paymentModel:Model<PaymentDocument>,
                @InjectModel(user.name) private userModel:Model<userDocument>,
                @InjectModel(instructor.name) private instructorModel:Model<instructorDocument>
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
        console.log('searching for order',orderId)
        const payment=await  this.paymentModel.findOne({orderId:orderId,status:'completed'})
        .populate('userId','name email') 
        .populate('coursesDetails.courseId','title')
        .exec()

        console.log('Found payment document:', payment);

        return payment
    }

    async updateOrderStatus(orderId:string,courseId:string,status:string):Promise<PaymentDocument|null>{
        console.log('updating the order status',{orderId,courseId,status})
        if(!Types.ObjectId.isValid(courseId)){
            throw new BadRequestException('Invalid course id')
        }

        const payment=await this.paymentModel.findOne({orderId:orderId,status:'completed'})

        console.log('Found payment document:', payment);

        if(!payment){
            throw new NotFoundException('order not found')
        }

        const courseDetail = payment.coursesDetails.find(detail => 
            detail.courseId._id.toString() === courseId || 
            detail.courseId.toString() === courseId
        );

        console.log('hashim jihaneey',courseDetail)


    
        if (!courseDetail) {
            throw new NotFoundException('Course not found in order');
        }

        const updatedPayment=await this.paymentModel.findOneAndUpdate(
            {
                orderId:orderId,
                status:'completed',
                'coursesDetails.courseId':courseDetail.courseId
            },
            {
                $set:{
                    'coursesDetails.$.status':status,
                    'coursesDetails.$.updatedAt':new Date()
                }
            },
            {
                new:true
            }
        ).populate('userId')

       console.log('Updated payment document:', updatedPayment);

       if (!updatedPayment) {
        throw new BadRequestException('Failed to update payment status');
    }

        return updatedPayment
    }



    ///here iam gonna do the code for getting admin dashboard
    async getDashboardStats(){

        //gonna fetch all the counts i need
        const [totalStudents,totalInstructors,totalCourses]=await Promise.all([
            this.userModel.countDocuments(),
            this.instructorModel.countDocuments(),
            this.courseModel.countDocuments()
        ])


        const currentYear=new Date().getFullYear()

        const monthlyData=await this.paymentModel.aggregate([
            {
                $match:{
                    status:'completed',
                    createdAt:{
                        $gte:new Date(currentYear,0,1),
                        $lte:new Date(currentYear,11,31)
                    }
                }
            },
            {
                $group:{
                    _id:{$month:'$createdAt'},
                    revenue:{$sum:'$amount'},
                    purchases:{$sum:1}
                }
            },
            {
                $sort:{_id:1}
            }
        ])

        const monthlySalesData = Array.from({ length: 12 }, (_, i) => {
            const monthData = monthlyData.find(data => data._id === i + 1) || { revenue: 0, purchases: 0 };
            return {
                month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
                revenue: monthData.revenue || 0,
                purchases: monthData.purchases || 0
            };
        })


        const totalRevenue=monthlySalesData.reduce((sum,data)=>sum+data.revenue,0)
        const totalPurchases=monthlySalesData.reduce((sum,data)=>sum+data.purchases,0)


        //finding top selling courses here
        const topSellingCourses=await this.paymentModel.aggregate([
            {
                $match:{status:'completed'}
            },
            {
                $unwind:'$coursesDetails'
            },
            {
                $group:{
                    _id:'$coursesDetails.courseId',
                    totalSales:{$sum:1},
                    revenue:{$sum:'$coursesDetails.amount'}
                }
            },
            {
                $lookup:{
                    from:'courses',
                    localField:'_id',
                    foreignField:'_id',
                    as:'courseDetails'
                }
            },
            {
                $unwind:'$courseDetails'
            },
            {
                $lookup:{
                    from:'instructors',
                    localField:'courseDetails.instructor',
                    foreignField:'_id',
                    as:'instructorDetails'
                }
            },
            {
                $unwind:'$instructorDetails'
            },
            {
                $project: {
                    _id: 1,
                    title: '$courseDetails.title',
                    instructor: {
                        name: '$instructorDetails.name',
                        email: '$instructorDetails.emailaddress'
                    },
                    totalSales: 1,
                    revenue: 1
                }
            },
            {
                $sort:{totalSales:-1}
            },
            {
                $limit:5
            }

        ])


        const topInstructors=await this.paymentModel.aggregate([
            {
                $match:{status:'completed'}
            },
            {
                $unwind:'$coursesDetails'
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
                $unwind:'$courseInfo'
            },
            {
                $group:{
                    _id:'$courseInfo.instructor',
                    totalSales:{$sum:1},
                    totalRevenue:{$sum:'$coursesDetails.amount'},
                    uniqueStudents:{$addToSet:'$userId'}
                }
            },
            {
                $lookup:{
                    from:'instructors',
                    localField:'_id',
                    foreignField:'_id',
                    as:'instructorDetails'
                }
            },
            {
                $unwind:'$instructorDetails'
            },
            {
                $project: {
                    _id: 1,
                    name: '$instructorDetails.name',
                    email: '$instructorDetails.emailaddress',
                    totalSales: 1,
                    totalRevenue: 1,
                    totalStudents: { $size: '$uniqueStudents' }  
                }
            },
            {
                $sort: { totalRevenue: -1 }  
            },
            {
                $limit: 5
            }

        ])


        return {
            totalStudents,
            totalInstructors,
            totalCourses,
            totalRevenue,
            totalPurchases,
            monthlySalesData,
            topSellingCourses,
            topInstructors  
        }


    }




}
