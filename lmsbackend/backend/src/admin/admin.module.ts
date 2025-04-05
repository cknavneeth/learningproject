import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { admin, adminSchema } from './admin.schema';
import { user, userSchema } from 'src/users/users.schema';
import { UsersModule } from 'src/users/users.module';
import { instructor, instructorSchema } from 'src/instructors/instructor.schema';
import { InstructorsModule } from 'src/instructors/instructors.module';
import { CategoryModule } from './category/category.module';
import { AdminRepository } from './repositories/admin/admin.repository';
import { Course, CourseSchema } from 'src/instructors/courses/course.schema';
import { EmailModule } from 'src/shared/email/email.module';

@Module({
  imports :[MongooseModule.forFeature([{name:admin.name,schema:adminSchema},{ name: user.name, schema: userSchema },{name:instructor.name,schema:instructorSchema},{name:Course.name,schema:CourseSchema}]),UsersModule, InstructorsModule, CategoryModule,EmailModule],
  controllers: [AdminController],
  providers: [AdminService,AdminRepository],
  exports:[AdminService],
})
export class AdminModule {}
