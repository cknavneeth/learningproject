import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { InstructorsModule } from 'src/instructors/instructors.module';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { AdminModule } from 'src/admin/admin.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AUTH_SERVICE } from './constants/constant';

const authServiceProvider={
  provide:AUTH_SERVICE,
  useClass:AuthService
}

@Module({
  imports:[UsersModule,InstructorsModule,CloudinaryModule,AdminModule,ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [AuthService,JwtService,authServiceProvider],
  controllers: [AuthController]
})
export class AuthModule {}
