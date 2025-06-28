import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { admin, admindocument } from './admin.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionType, user, userDocument } from 'src/users/users.schema';
import { instructor, instructorDocument } from 'src/instructors/instructor.schema';
import { AdminRepository } from './repositories/admin/admin.repository';
import { EmailService } from 'src/shared/email/email.service';

@Injectable()
export class AdminService {
    constructor(@InjectModel(admin.name) private adminmodel:Model<admindocument>,
    @InjectModel(user.name) private usermodel:Model<userDocument>,
    @InjectModel(instructor.name) private instructorModel:Model<instructorDocument>,

    private readonly _adminRepository:AdminRepository,

    private readonly _emailService:EmailService
 ){}

    async findbyEmail(email:string){
        let admin=await this.adminmodel.findOne({email})
        return admin
    }

    async fetchallstudents(){
        return this.usermodel.find().select('username email isBlocked isVerified').sort({createdAt:-1})
    }

    async toggleBlockStatus(studentId:string):Promise<user>{

        if(!studentId){
            throw new NotFoundException('student not found')
        }

        if (!Types.ObjectId.isValid(studentId)) {
            throw new BadRequestException('Invalid student ID format');
        }

        const student=await this.usermodel.findById(studentId)
        if(!student){
            throw new NotFoundException('student not found')
        }
        const updatedStudent=await this.usermodel.findByIdAndUpdate(studentId,{isBlocked:!student.isBlocked},{new:true})

        if(!updatedStudent){
            throw new NotFoundException('Failed to update student')
        }
        return updatedStudent!
    }

    async fetchallinstructors(){
        return this.instructorModel.find().select('name emailaddress isBlocked isVerified isApproved certificateUrl')
    }

    async blockstatus(instructorId:string){
        if(!instructorId){
            throw new NotFoundException('instructor not found')
        }

        if(!Types.ObjectId.isValid(instructorId)){
            throw new BadRequestException('Invalid instructor ID format')
        }

        const instructor=await this.instructorModel.findById(instructorId)
        if(!instructor){
            throw new NotFoundException('instructor not found')
        }

        const updatedInstructor=await this.instructorModel.findByIdAndUpdate(instructorId,{isBlocked:!instructor.isBlocked},{new:true})

        if(!updatedInstructor){
            throw new NotFoundException('Failed to update instructor')
        }

        return updatedInstructor!
    }



    async verifyinstructor(instructorId:string,isApproved:boolean,feedback?:string){
        if(!instructorId){
            throw new NotFoundException('instructor not found')
        }
        if(!Types.ObjectId.isValid(instructorId)){
            throw new BadRequestException('Invalid instructor ID format')
        }

        let instructor=await this.instructorModel.findById(instructorId)
        if(!instructor){
            throw new NotFoundException('instructor not found')
        }
        instructor.isApproved=isApproved
        if(!isApproved&&feedback){
            instructor.rejectionFeedback=feedback
            instructor.rejectedAt=new Date()
            instructor.canReapply=true
        }else{
            instructor.rejectionFeedback=undefined
            instructor.rejectedAt=undefined
            instructor.canReapply=false
        }
        await instructor.save()
        return instructor


    }


    async getAllCourses(page:number=1,limit:number=10){
        // return this.adminRepository.getAllCourses()
        const {courses,total}=await this._adminRepository.getAllCourses(page,limit)

        return {
            courses,
            pagination:{
                total,
                page,
                limit,
                totalPages:Math.ceil(total/limit)
            }
        }
    }

    async updateCourseStatus(courseId:string,isApproved:boolean,feedback?:string){
        console.log('ingot ethiyo')
        const course=await this._adminRepository.updateCourseStatus(courseId,isApproved,feedback)

        if(!course){
            throw new NotFoundException('Failed to update course')
        }

        const instructorEmail=course.instructor['emailaddress']
        const courseName = course.title;

        console.log('Course details:', { instructorEmail, courseName, isApproved });
        if (isApproved) {
            await this._emailService.sendCourseApprovalEmail(instructorEmail, courseName);
        } else {
            console.log('hmmmr reject aay')
            await this._emailService.sendCourseRejectionEmail(instructorEmail, courseName, feedback||'No feedback provided');
        }

        return course;
    }


    async addCourseOffer(courseId:string,offerData:{percentage:number;discountPrice:number}){
        const course=await this._adminRepository.getCourseById(courseId)

        if(!course){
            throw new NotFoundException('Course not found')
        }

        if(course.offer){
            throw new BadRequestException('course already has an offer')
        }

        if(offerData.percentage<1||offerData.percentage>99){
            throw new BadRequestException('Discount percentage must be in between 1 and 99')
        }

        const expectedDiscountPrice=Math.round((course.price-(course.price*(offerData.percentage/100)))*100)/100

        if(Math.abs(expectedDiscountPrice-offerData.discountPrice)>0.01){
            throw new BadRequestException('invalid discounted price calculation')
        }

        const updatedCourse=await this._adminRepository.addCourseOffer(courseId,offerData)
        console.log(updatedCourse)
        if(!updatedCourse){
            throw new BadRequestException('failded to add course')
        }

        const instructorEmail = updatedCourse.instructor['emailaddress'] || updatedCourse.instructor['email'];
    
        if (!instructorEmail) {
            console.error('Instructor details:', instructor);
            throw new BadRequestException('Instructor email not found');
        }

    try {
        await this._emailService.sendCourseOfferNotification(
            instructorEmail,
            updatedCourse.title,
            offerData.percentage
        );
    } catch (error) {
        console.error('Error sending email notification:', error);
        // Continue with the operation even if email fails
    }

        return updatedCourse
    }





    async removeCourseOffer(courseId:string){
        const course=await this._adminRepository.getCourseById(courseId)

        if(!course){
            throw new NotFoundException('Course Not found')
        }

        if(!course.offer){
            throw new BadRequestException('No offer exists for this course')
        }

        const updatedCourse=await this._adminRepository.removeCourseOffer(courseId)

        if(!updatedCourse){
            throw new BadRequestException('Failed to remove offer')
        }

        const instructor=updatedCourse.instructor as any

        if(instructor?.emailaddress){
            try {
                await this._emailService.sendCourseRemovalNotification(instructor.emailaddress,updatedCourse.title)
            } catch (error) {
                console.error('error sending email notification',error)
            }
        }
        return updatedCourse
    }




    //for getting sales history
    async getSalesHistory(page:number=1,limit:number=10){
        const {sales,total}=await this._adminRepository.getSalesHistory(page,limit)

        const formattedSales=sales.map(sale=>({
            _id: sale._id ,
            orderId: sale.orderId,
            student: {
                name:sale.student?.username||'unknown name',
                email: sale.student?.email||'unknown email'
            },
            courses: sale.coursesDetails || [],
            totalAmount: sale.amount,
            status: sale.status,
            purchaseDate: sale.purchaseDate,
            cancellationReason: sale.coursesDetails.map(course=>course.cancellationReason)
        }))

        return {
            sales:formattedSales,
            pagination:{
                total,
                page,
                limit,
                totalPages:Math.ceil(total/limit)
            }

        }
    }


    async approveRefund(orderId:string,courseId:string){
        console.log('Processing refund in service')
        const payment=await this._adminRepository.getOrderById(orderId)

        console.log('found payment',payment)

        if(!payment){
            throw new NotFoundException('order not found')
        }

        console.log('Courses Details:', JSON.stringify(payment.coursesDetails, null, 2));

        const courseToRefund = payment.coursesDetails.find(course => {
            console.log('Comparing:', {
                providedCourseId: courseId,
                currentCourseId: course.courseId.toString(),
                status: course.status
            });
            // Check if courseId is populated object or ObjectId
            const currentCourseId = course.courseId._id ? course.courseId._id.toString() : course.courseId.toString();
            return currentCourseId === courseId && course.status === 'cancellation_pending';
        });
        console.log('course to refund',courseToRefund)

        if(!courseToRefund){
            throw new BadRequestException('refund not requested')
        }

        if (courseToRefund.status !== 'cancellation_pending') {
            throw new BadRequestException('Refund not requested for this course');
        }

        const refundAmount=courseToRefund.amount


        console.log('Attempting to update order status with:', {
            orderId,
            courseId,
            refundAmount
        });

        const updatedPayment=await this._adminRepository.updateOrderStatus(orderId,courseId,'cancelled')

        if(!updatedPayment){
            throw new BadRequestException('Failed to update order')
        }

        //now i need to add refund amount to the students wallet
        const student=await this.usermodel.findById(payment.userId)
        if(!student){
            throw new NotFoundException('student not found')
        }


        if(!student.wallet){
            student.wallet=0
        }


        student.wallet+=refundAmount
        student.transactions.push({
            type:TransactionType.CREDIT,
            amount:refundAmount,
            date:new Date(),
            description:`Refund for order ${orderId}`
        })
        await student.save()

        try {
            await this._emailService.sendRefundApprovalEmail(
                (payment.userId as any).email,
                orderId,
                [(courseToRefund.courseId as any).title],
                refundAmount
                
            )
        } catch (error) {
            console.error('Error sending refund approval email',error)
        }


        return {
            message:'Refund approved successfully',
            orderId:updatedPayment.orderId,
            courseId:courseId,
            refundAmount:refundAmount

        }


    }


    //get dashboard stats from service
    async getDashboardStats(){
        return this._adminRepository.getDashboardStats()
    }


}


