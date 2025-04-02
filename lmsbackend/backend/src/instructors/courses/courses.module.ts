import { Module } from '@nestjs/common';
import { CourseRepository } from './repositories/course/course.repository';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './course.schema';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary.module';
import { AuthenticationModule } from '../../authentication/auth.module';


@Module({
  imports:[MongooseModule.forFeature([{name:Course.name,schema:CourseSchema}]),CloudinaryModule,AuthenticationModule],
  controllers:[CoursesController],
  providers: [CourseRepository,CoursesService],
  exports:[CourseRepository,CoursesService]
})
export class CoursesModule {}
