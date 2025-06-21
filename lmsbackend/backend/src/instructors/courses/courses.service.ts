import { BadRequestException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CourseRepository } from './repositories/course/course.repository';
import { Course, CourseStatus } from './course.schema';
import { Types } from 'mongoose';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { REVIEW_REPOSITORY } from 'src/reviews/constants/review.constant';
import { IReviewRepository } from 'src/reviews/repository/interfaces/review.repository.interface';

@Injectable()
export class CoursesService {
    private readonly logger=new Logger(CoursesService.name)
    constructor(private readonly courseRepository:CourseRepository,private cloudinaryService:CloudinaryService,
        @Inject(REVIEW_REPOSITORY) private readonly reviewRepository:IReviewRepository
    ){}

    async createCourse(courseData:Partial<Course>,instructorId:string){
        return this.courseRepository.create({
            ...courseData,
            instructor:new Types.ObjectId(instructorId),
            status:CourseStatus.DRAFT
        })
    }


    async uploadVideo(file:Express.Multer.File){

        if(!file){
            throw new BadRequestException('No file uploaded')
        }

        if(!file.mimetype.includes('video')){
            throw new BadRequestException('File must be a video')
        }

        

         try {
            const videoUrl=await this.cloudinaryService.UploadedFile(file)
            return videoUrl
         } catch (error) {
            throw new BadRequestException(`failed to upload video ${error.message}`)
         }
    }


    //for uploading thumbnails
    async uploadThumbnail(file:Express.Multer.File){
        if(!file.mimetype.includes('image')){
            throw new BadRequestException('File must be an image')
        }

        try{
            const thumbnailUrl=await this.cloudinaryService.UploadedFile(file)
            return thumbnailUrl
        }catch(error){
            throw new BadRequestException('Failed to Upload thumbnail')
        }
    }


    async getCoursesByInstructor(instructorId:string){
        return this.courseRepository.findByInstructor(instructorId)
    }

    async updateCourse(courseId: string, courseData: Partial<Course>, instructorId: string) {
        const existingCourse = await this.courseRepository.findById(courseId);
        if (!existingCourse) {
            throw new NotFoundException('Course not found initially');
        }

        if (existingCourse.instructor.toString() !== instructorId) {
            throw new UnauthorizedException('Not authorized to update this course');
        }

        // Sanitize the courseData by removing MongoDB-specific fields
        const sanitizedData = { ...courseData };
        delete (sanitizedData as any)._id;
        delete (sanitizedData as any).createdAt;
        delete (sanitizedData as any).updatedAt;
        delete (sanitizedData as any).__v;
        delete sanitizedData.instructor;

        console.log('sanitized daatta',sanitizedData)
        // Handle status updates
        if (sanitizedData.status) {
            if (sanitizedData.status === CourseStatus.DRAFT) {
                sanitizedData.status = CourseStatus.DRAFT;
            } else if (sanitizedData.status === CourseStatus.PUBLISHED) {
                sanitizedData.status = CourseStatus.PUBLISHED;
            } else if (sanitizedData.status === CourseStatus.PENDING_REVIEW) {
                sanitizedData.status = CourseStatus.PENDING_REVIEW;
            } else if (sanitizedData.status === CourseStatus.REJECTED) {
                sanitizedData.status = CourseStatus.REJECTED;
            }
        }

        const updatedCourse = await this.courseRepository.update(
            courseId,
            sanitizedData,
            instructorId
        );

        if (!updatedCourse) {
            throw new NotFoundException('Course not found');
        }

        return updatedCourse;
    }


    async publishCourse(courseId:string,instructorId:string){
        return this.courseRepository.update(courseId,{status:CourseStatus.PENDING_REVIEW},instructorId)
    }

    async uploadResource(file:Express.Multer.File){
        if(!file){
            throw new BadRequestException('No file uploaded')
        }

        try{
            const fileUrl=await this.cloudinaryService.UploadedFile(file)
            return fileUrl
        }catch(error){
            throw new BadRequestException(`failed to upload resource ${error.message}`)
        }
    }


    //for drafts instructor ok lets cod
    async getDrafts(instructorId:string){
       try {
        const drafts=await this.courseRepository.findByInstructorAndStatus(instructorId,[CourseStatus.DRAFT,CourseStatus.REJECTED])
        return drafts
       } catch (error) {
          throw new BadRequestException('Failed to fetch drafts')
       }
    }


    async deleteDraft(draftId:string,instructorId:string){
        try {
            const draft=await this.courseRepository.findById(draftId)
             if(!draft){
                throw new NotFoundException('Draft not found')
             }
             if(draft.instructor.toString()!==instructorId){
                   throw new BadRequestException('Unauthorized to delete this draft')

             }
             const result=await this.courseRepository.findByIdAndDelete(draftId)
             return result
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Failed to delete draft');
        }
        
    }



    async getCourseById(courseId:string,instructorId:string){
        const course=await this.courseRepository.findById(courseId)
        if(!course){
            throw new NotFoundException('Course not found')
        }

        if(course.instructor.toString()!==instructorId){
            throw new BadRequestException('Unauthorized to access this course')
        }

        return course
    }



    async getCoursesForInstructor(instructorId:string,page:number,limit:number,searchTerm:string){
        try {
            const {courses,total}=await this.courseRepository.findByInstructorWithPagination(instructorId,page,limit,searchTerm)
           console.log('courses veno monu',courses)
            return {
                status: 'success',
                data: {
                    courses: courses || [],
                    pagination: {
                        total: total || 0,
                        page: page,
                        limit: limit,
                        totalPages: Math.ceil((total || 0) / limit)
                    }
                }
            };
        } catch (error) {
            throw new BadRequestException('Failed to fetch courses');
        }
    }




    async getEnrolledStudents(instructorId:string,page:number,limit:number,searchTerm:string){
        try {
            const result=await this.courseRepository.getEnrolledStudents(new Types.ObjectId(instructorId),page,limit,searchTerm)

            this.logger.log('enrolled student result',result)

            const totalStudents=result.total

            return {
                status:'success',
                data:{
                    students:result.students.map(enrollment=>({
                        studentId:enrollment._id,
                        name:enrollment.name,
                        email:enrollment.email,
                        totalPurchases:enrollment.totalPurchases,
                        lastPurchaseDate:enrollment.lastPurchaseDate,
                        courses:enrollment.courses.flat().map(course=>({
                            courseId:course._id,
                            title:course.title,
                            price:course.price
                        }))
                    })),
                    pagination:{
                        total:totalStudents,
                        page,
                        limit,
                        totalPages:Math.ceil(result.total/limit)
                    }
                }
            }
            
        } catch (error) {

            console.log('error fetching enrolled students',error)
            throw new BadRequestException('Failed to fetch enrolled students')

        }

    }


    //get course details page for instructor
    async getCourseDetailsForInstructor(courseId:string,instructorId:string){
        try {
            const course=await this.courseRepository.findById(courseId)

            if(!course){
                throw new NotFoundException('Course not found')
            }

            //verify 
            if(course.instructor.toString()!==instructorId){
                throw new UnauthorizedException('you do not have permission to view this course')
            }

            //get reviews for this course
            const reviews=await this.reviewRepository.findByCourse(courseId)

            //get enrollment statistics
            const enrollmentStats=await this.courseRepository.getEnrollmentStats(courseId)

            const revenueData = await this.courseRepository.getCourseRevenue(courseId);

            const monthlyData=await this.courseRepository.getMonthlyEnrollmentData(courseId)

            const enrollmentTrend = monthlyData.map(item => item.enrollments);
            const revenueTrend = monthlyData.map(item => item.revenue);
            const monthLabels = monthlyData.map(item => item.month);

           return {
            course,
            stats: {
                totalEnrollments: enrollmentStats.totalEnrollments || 0,
                completionRate: enrollmentStats.completionRate || 0,
                revenue: revenueData.totalRevenue || 0,
                lastEnrollment: enrollmentStats.lastEnrollment || null,
                enrollmentTrend,
                revenueTrend,
                monthLabels
            },
            reviews
        };

        } catch (error) {
            this.logger.error(`Error fetching course details: ${error.message}`, error.stack);
            throw error; this.logger.error(`Error fetching course details: ${error.message}`, error.stack);
            throw error;
        }
    }

}
