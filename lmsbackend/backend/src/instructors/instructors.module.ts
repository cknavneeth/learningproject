import { Module } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { InstructorsController } from './instructors.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { instructor, instructorSchema } from './instructor.schema';
import { InstructorRepository} from './repositories/instructor/instructor.repository';
import { AuthenticationModule } from 'src/authentication/auth.module';
import { CoursesController } from './courses/courses.controller';
import { CoursesService } from './courses/courses.service';
import { CoursesModule } from './courses/courses.module';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { Course, CourseSchema } from './courses/course.schema';
import { Payment, PaymentSchema } from 'src/payment/schema/payment.schema';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { INSTRUCTOR_REPOSITORY } from './constants/instructor.constant';

export const instructorRepoProvider={
  provide:INSTRUCTOR_REPOSITORY,
  useClass:InstructorRepository
}

@Module({
  imports:[MongooseModule.forFeature([{name:instructor.name,schema:instructorSchema},{name:Course.name,schema:CourseSchema},{name:Payment.name,schema:PaymentSchema}]),AuthenticationModule, CoursesModule,CloudinaryModule,ReviewsModule],
  providers: [
    InstructorsService, 
    InstructorRepository,
    CoursesService,

    //  {
    //   provide:INSTRUCTOR_REPOSITORY,
    //   useClass:InstructorRepository
    //  }
    instructorRepoProvider
     
    ],
  controllers: [InstructorsController, CoursesController],
  exports:[InstructorsService,InstructorRepository,instructorRepoProvider]
})
export class InstructorsModule {}
