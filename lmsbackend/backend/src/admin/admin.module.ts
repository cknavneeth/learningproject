import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { admin, adminSchema } from './admin.schema';

@Module({
  imports :[MongooseModule.forFeature([{name:admin.name,schema:adminSchema}])],
  controllers: [AdminController],
  providers: [AdminService],
  exports:[AdminService]
})
export class AdminModule {}
