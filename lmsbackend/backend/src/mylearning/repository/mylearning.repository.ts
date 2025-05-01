import { Injectable, Logger } from '@nestjs/common';
import { IMyLearningRepository } from './interfaces/mylearning.repository.interface';
import { CourseProgress, CourseProgressDocument } from '../schema/course-progress.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from 'src/instructors/courses/course.schema';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { Payment, PaymentDocument } from 'src/payment/schema/payment.schema';


interface PopulatedCourse extends Document {
    title: string;
    price: number;
    thumbnailUrl: string;
    instructor: {
        name: string;
    };
}


@Injectable()
export class MylearningRepository implements IMyLearningRepository {

    private logger=new Logger(MylearningRepository.name)


    constructor(
        @InjectModel(CourseProgress.name) private progressModel: Model<CourseProgressDocument>,
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
        @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>
    ) {}

    async findEnrolledCourses(userId: string, skip: number, limit: number): Promise<{ courses: EnrolledCourse[]; total: number; }> {
        console.log('Finding enrolled courses for userId:', userId);

        console.log('hmm ingot keri hmm')
        const completedPayments=await this.paymentModel.find({
            userId:new Types.ObjectId(userId),
            status:'completed'
        })
        .lean()

        console.log('Raw completed payments:', completedPayments);

        //iam extracting all courses id from completed payments
        const enrolledCourseIds = completedPayments.reduce((acc: Types.ObjectId[], payment) => {
            const courseIds = payment.coursesDetails?.filter(detail=>detail.status!=='cancelled').map(detail => detail.courseId) || [];
            return [...acc, ...courseIds];
        }, []);



        const uniqueCourseIds=[...new Set(enrolledCourseIds.map(id=>id.toString()))]

        console.log('Unique course IDs:', uniqueCourseIds);

        const total = uniqueCourseIds.length;

        const safeSkip = Math.min(skip, uniqueCourseIds.length);
        const paginatedCourseIds = uniqueCourseIds.slice(safeSkip, safeSkip + limit);

        this.logger.log('Paginated course IDs:', paginatedCourseIds);

        if (paginatedCourseIds.length === 0) {
            return {
                courses: [],
                total: uniqueCourseIds.length
            };
        }
            

        const courses = await Promise.all(
            paginatedCourseIds.map(async (courseId) => {
                this.logger.log('Fetching course with ID:', courseId);

                  try {
                const course = await this.courseModel
                    .findById(courseId)
                    .select('title price thumbnailUrl instructor')
                    .populate('instructor', 'name')
                    .lean();

                this.logger.log('Course found from database:', course);

                if (!course) {
                    console.log(`No course found for ID: ${courseId}`);
                    return null;
                }

                //finding payement record to get purchase date
                const payment = await this.paymentModel.findOne({
                    userId: new Types.ObjectId(userId),
                    'coursesDetails.courseId': new Types.ObjectId(courseId),
                    status: 'completed'
                })
                .select('purchaseDate')
                .lean();

                const progress = await this.progressModel
                    .findOne({
                        userId: new Types.ObjectId(userId),
                        courseId: new Types.ObjectId(courseId)
                    })
                    .lean();

                this.logger.log('Progress found:', progress);

                const enrolledCourse = {
                    _id: courseId,
                    title: course.title,
                    price: course.price,
                    thumbnailUrl: course.thumbnailUrl,
                    instructor: {
                        name: (course.instructor as any)?.name || 'Unknown'
                    },
                    progress: progress?.overallProgress || 0,
                    hasReviewed:progress?.hasReviewed||false,
                    purchaseDate:payment?.purchaseDate
                } as EnrolledCourse;

                this.logger.log('Constructed enrolled course:', enrolledCourse);
                return enrolledCourse;
            } catch (error) {
                console.error('Error fetching course:', error);
                return null;
            }
            })
        );



        const validCourses = courses.filter((course): course is NonNullable<typeof course> => 
            course !== null
        );

        console.log('Final courses to return:', validCourses);

        return { 
            courses: validCourses,
            total 
        };

    }


    async isEnrolled(userId:string,courseId:string):Promise<boolean>{

  console.log('checking enrollment for:',{
    userId:userId,
    courseId:courseId
  })


        const payment=await this.paymentModel.findOne({
            userId:new Types.ObjectId(userId),
            'coursesDetails.courseId':new Types.ObjectId(courseId),
            status:'completed'
        })

        this.logger.log('Payment record found:', payment);
        return !!payment
    }

    async findCourseById(courseId:string):Promise<any>{
        return this.courseModel.findById(courseId).populate('instructor','name').lean()
    }


    async findProgress(userId:string,courseId:string):Promise<CourseProgress|null>{
        return this.progressModel.findOne({
            userId:new Types.ObjectId(userId),
            courseId:new Types.ObjectId(courseId)
        })
    }

    async createProgress(userId:string,courseId:string):Promise<CourseProgress>{
        const progress=new this.progressModel({
            userId:new Types.ObjectId(userId),
            courseId:new Types.ObjectId(courseId),
            completedSections:[],
            sectionProgress:new Map(),
            videoTimestamps:new Map(),
            currentSection:"0",
            overallProgress:0
        })
        return progress.save()
    }

    async updateProgress(userId:string,courseId:string,updateData:UpdateProgressDto):Promise<CourseProgress>{

        const progress=await this.progressModel.findOne({
            userId:new Types.ObjectId(userId),
            courseId:new Types.ObjectId(courseId)
        })

        if(!progress){
            return this.createProgress(userId,courseId)
        }

        console.log('Progress found:', progress);


        progress.sectionProgress.set(updateData.sectionId,updateData.progress)

        if(updateData.timestamp!==undefined){
            progress.videoTimestamps.set(updateData.sectionId,updateData.timestamp)
        }

       //add to completed section if progress is 100
       if(updateData.progress===100&&!progress.completedSections.includes(updateData.sectionId)){
        progress.completedSections.push(updateData.sectionId)
       }

       progress.currentSection=updateData.sectionId

       const course = await this.courseModel.findById(courseId)
       if (!course || !course.sections) {
           console.error('Course or sections not found')
           return progress.save()
       }

       
        const totalSections=course.sections.length
        const completedSections=progress.completedSections.length
        progress.overallProgress=Math.round((completedSections/totalSections)*100)

        

        return progress.save()
    }



    async getCourseProgress(userId:string,courseId:string):Promise<CourseProgress|null>{
       
        const existingProgress=await this.progressModel.findOne({
            userId:new Types.ObjectId(userId),
            courseId:new Types.ObjectId(courseId)
        })

        if(!existingProgress){
            return this.createProgress(userId,courseId)
        }

        return existingProgress
    }
}
