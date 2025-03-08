import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { InstructorsModule } from 'src/instructors/instructors.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports:[UsersModule,InstructorsModule,CloudinaryModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
