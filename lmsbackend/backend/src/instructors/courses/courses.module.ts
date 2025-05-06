import { Module } from '@nestjs/common';
import { CourseRepository } from './repositories/course/course.repository';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './course.schema';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';
import { AuthenticationModule } from '../../authentication/auth.module';
import { Payment, PaymentSchema } from 'src/payment/schema/payment.schema';
import { CourseProgress, CourseProgressSchema } from 'src/mylearning/schema/course-progress.schema';
import { ReviewsModule } from 'src/reviews/reviews.module';


@Module({
  imports:[MongooseModule.forFeature([{name:Course.name,schema:CourseSchema},{name:Payment.name,schema:PaymentSchema},{name:CourseProgress.name,schema:CourseProgressSchema}]),CloudinaryModule,AuthenticationModule,ReviewsModule],
  controllers:[CoursesController],
  providers: [CourseRepository,CoursesService],
  exports:[CourseRepository,CoursesService]
})
export class CoursesModule {}
