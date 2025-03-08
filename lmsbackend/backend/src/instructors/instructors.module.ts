import { Module } from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { InstructorsController } from './instructors.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { instructor, instructorSchema } from './instructor.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:instructor.name,schema:instructorSchema}])],
  providers: [InstructorsService],
  controllers: [InstructorsController],
  exports:[InstructorsService]
})
export class InstructorsModule {}
