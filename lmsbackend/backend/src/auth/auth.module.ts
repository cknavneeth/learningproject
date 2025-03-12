import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { InstructorsModule } from 'src/instructors/instructors.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports:[UsersModule,InstructorsModule,CloudinaryModule,AdminModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
