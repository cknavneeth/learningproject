import { Module } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { InstructorsController } from './instructors.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { instructor, instructorSchema } from './instructor.schema';
import { InstructorRepository} from './repositories/instructor/instructor.repository';
import { AuthenticationModule } from 'src/authentication/auth.module';

@Module({
  imports:[MongooseModule.forFeature([{name:instructor.name,schema:instructorSchema}]),AuthenticationModule],
  providers: [InstructorsService, InstructorRepository],
  controllers: [InstructorsController],
  exports:[InstructorsService]
})
export class InstructorsModule {}
