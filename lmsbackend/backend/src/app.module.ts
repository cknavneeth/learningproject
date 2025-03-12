import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { InstructorsModule } from './instructors/instructors.module';
import { AdminModule } from './admin/admin.module';

console.log(process.env.MONGO_URI)
@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Learningmanagement'),AuthModule, UsersModule, InstructorsModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
