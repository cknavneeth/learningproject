import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { admin, adminSchema } from './admin.schema';
import { user, userSchema } from 'src/users/users.schema';
import { UsersModule } from 'src/users/users.module';
import { instructor, instructorSchema } from 'src/instructors/instructor.schema';
import { InstructorsModule } from 'src/instructors/instructors.module';

@Module({
  imports :[MongooseModule.forFeature([{name:admin.name,schema:adminSchema},{ name: user.name, schema: userSchema },{name:instructor.name,schema:instructorSchema}]),UsersModule, InstructorsModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports:[AdminService],
})
export class AdminModule {}
