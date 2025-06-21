import { Injectable, Logger } from '@nestjs/common';
import { ICourseRepository } from '../course.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument, CourseStatus } from '../../course.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { Payment, PaymentDocument } from 'src/payment/schema/payment.schema';
import { CourseProgress, CourseProgressDocument } from 'src/mylearning/schema/course-progress.schema';
import { combineLatest } from 'rxjs';

@Injectable()
export class CourseRepository implements ICourseRepository{
    constructor(@InjectModel(Course.name) private courseModel:Model<CourseDocument>,@InjectModel(Payment.name) private paymentModal:Model<PaymentDocument>,@InjectModel(CourseProgress.name) private progressModel:Model<CourseProgressDocument>){}
    
    private logger=new Logger()
    async create(courseData:Partial<Course>):Promise<CourseDocument>{

        
        const course=new this.courseModel(courseData)
        return course.save()
    }

    async findByInstructor(instructorId:string):Promise<CourseDocument[]>{
        return this.courseModel.find({instructor:new Types.ObjectId(instructorId)}).exec()
    }

    async update(courseId:string,courseData:Partial<Course>,instructorId:string):Promise<CourseDocument|null>{
       return this.courseModel.findOneAndUpdate(
        {
            _id:new Types.ObjectId(courseId),
            instructor:new Types.ObjectId(instructorId)
        },
        {
            $set:courseData
        },
        {
            new:true,
            runValidators:true
        }
       ).exec()
    }


    async findByInstructorAndStatus(instructorId:string,status:CourseStatus|CourseStatus[]):Promise<CourseDocument[]>{
        return this.courseModel.find({instructor:new Types.ObjectId(instructorId),
            status:Array.isArray(status)?{$in:status}:status
        }).sort({updatedAt:-1}).exec()
    }

    async findById(courseId:string):Promise<CourseDocument|null>{
        return this.courseModel.findById(courseId).exec()
    }


    async findByIdAndDelete(courseId:string):Promise<CourseDocument|null>{
        return this.courseModel.findByIdAndDelete(courseId)
    }

    async findByInstructorWithPagination(instructorId:string,page:number=1,limit:number=10,searchTerm:string):Promise<{courses:CourseDocument[],total:number}>{
        const skip=(page-1)*limit

        
        const instructorObjectId=new Types.ObjectId(instructorId)

        const query:any={
            instructor:instructorObjectId
        }

        if(searchTerm&&searchTerm.trim()!==''){
            const regex=new RegExp(searchTerm.trim(),'i')
            query.$or=[
                {title:{$regex:regex}},
                {description:{$regex:regex}},
                {category:{$regex:regex}}
            ]
        }

        this.logger.log(query)

        const [courses,total]=await Promise.all([
            this.courseModel
            // .find({instructor:new Types.ObjectId(instructorId)})
            .find(query)
            .populate('instructor','name emailAddress isApproved')
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .exec(),
            // this.courseModel.countDocuments({instructor:new Types.ObjectId(instructorId)}).exec()
            this.courseModel.countDocuments({instructor:new Types.ObjectId(instructorId)}).exec()
        ])




        return {courses,total}
    }



    async getEnrolledStudents(instructorId: Types.ObjectId, page: number, limit: number, SearchTerm:string): Promise<{ students: any[]; total: number }> {

        const skip = (page - 1) * limit;
        
        const instructorCourses = await this.courseModel.find({ instructor: instructorId }).select('_id').lean();
        const courseIds = instructorCourses.map(course => course._id);
        
        console.log('Instructor courses found:', courseIds);

        // First check if we have any payments matching our criteria
        const matchingPayments = await this.paymentModal.find({
            'coursesDetails.courseId': { $in: courseIds },
            status: 'completed'
        }).lean();
        
        console.log('Matching payments found:', matchingPayments.length);
        if (matchingPayments.length > 0) {
            console.log('Sample payment:', matchingPayments[0]);
        }

        //for finding total students who enrolled in the course
        const countPipeline=[
            {
                $match:{
                    'coursesDetails.courseId':{$in:courseIds},
                    status:'completed'
                }
            },
            {
                $group:{
                    _id:'$userId'
                }
            },
            {
                $count:'total'
            }
        ]

        const totalCount=await this.paymentModal.aggregate(countPipeline)
        const uniqueStudentsCount=totalCount.length>0?totalCount[0].total:0
       

        const pipeline = [
            {
                $match: {
                    'coursesDetails.courseId': { $in: courseIds },
                    status: 'completed'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: false
                }
            },



            {
                $match:{
                  $or:[
                       {'userDetails.name':{$regex:SearchTerm,$options:'i'}},
                       {'userDetails.email':{$regex:SearchTerm,$options:'i'}}
                   ]
                }
                
               
            },





            {
                $lookup: {
                    from: 'courses',
                    localField: 'courses',
                    foreignField: '_id',
                    as: 'coursesDetails'
                }
            },
            {
                $unwind: {
                    path: '$coursesDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$userId',
                    student: { $first: '$userDetails' },
                    courses: { $push: '$coursesDetails' },
                    totalPurchases: { $sum: 1 },
                    lastPurchaseDate: { $max: '$updatedAt' }
                }
            },
            {
                $skip: skip  
            },
            {
                $limit: limit
            }
        ];

        
        let currentPipeline: PipelineStage[] = [];
        for (const stage of pipeline) {
            currentPipeline.push(stage);
            const result = await this.paymentModal.aggregate(currentPipeline);
            console.log(`Stage ${Object.keys(stage)[0]} results:`, {
                count: result.length,
                sample: result.length > 0 ? result[0] : null
            });
        }

        const enrollments = await this.paymentModal.aggregate(pipeline);

       

        return {
            students: enrollments.map(enrollment => ({
                studentId: enrollment._id,
                name: enrollment.student.name,
                email: enrollment.student.email,
                totalPurchases: enrollment.totalPurchases,
                lastPurchaseDate: enrollment.lastPurchaseDate,
                courses: enrollment.courses.map(course => ({
                    courseId: course._id,
                    title: course.title,
                    price: course.price
                }))
            })),
            total:uniqueStudentsCount
        };
    }


    //get enrollement stats
    async getEnrollmentStats(courseId:string):Promise<any>{
        const courseObjectId=new Types.ObjectId(courseId)

        const enrollments=await this.paymentModal.find({

            'coursesDetails.courseId':courseObjectId,
            status:'completed'
        }).sort({createdAt:-1}).lean()


        const progressData=await this.progressModel.find({
            courseId:courseObjectId
        }).lean()


        let completionRate=0
        if(progressData.length>0){
            const completedCount=progressData.filter(p=>p.overallProgress>=90).length

            completionRate=Math.round((completedCount/progressData.length)*100)
        }


        return {
            totalEnrollments: enrollments.length,
            completionRate,
            lastEnrollment: enrollments.length > 0 ? enrollments[0].purchaseDate : null
        }

    }




    async getCourseRevenue(courseId: string): Promise<any> {
        const courseObjectId = new Types.ObjectId(courseId);
        
        // Aggregate revenue data
        const revenueData = await this.paymentModal.aggregate([
            {
                $match: {
                    'coursesDetails.courseId': courseObjectId,
                    status: 'completed'
                }
            },
            {
                $unwind: '$coursesDetails'
            },
            {
                $match: {
                    'coursesDetails.courseId': courseObjectId
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$coursesDetails.amount' },
                    transactions: { $sum: 1 }
                }
            }
        ]);
        
        return {
            totalRevenue: revenueData.length > 0 ? revenueData[0].totalRevenue : 0,
            transactions: revenueData.length > 0 ? revenueData[0].transactions : 0
        };
    }


    async getMonthlyEnrollmentData(courseId:string):Promise<any[]>{
        const courseObjectId=new Types.ObjectId(courseId)

        const currentYear=new Date().getFullYear()

        const monthlyData=await this.paymentModal.aggregate([
            {
                $match:{
                    'coursesDetails.courseId':courseObjectId,
                    status:'completed',
                    createdAt:{
                        $gte:new Date(currentYear,0,1),
                        $lte:new Date(currentYear,11,31)
                    }
                }
            },
            {
                $unwind: '$coursesDetails'  
            },
            {
                $match: {
                    'coursesDetails.courseId': courseObjectId  
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 },
                    revenue: { $sum: '$coursesDetails.amount' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])

        return Array.from({ length: 12 }, (_, i) => {
            const monthData = monthlyData.find(data => data._id === i + 1) || { count: 0, revenue: 0 };
            return {
                month: new Date(currentYear, i).toLocaleString('default', { month: 'short' }),
                enrollments: monthData.count || 0,
                revenue: monthData.revenue || 0
            };
        });
    }

}
