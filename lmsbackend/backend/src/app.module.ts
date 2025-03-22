import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './authforall/auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InstructorsModule } from './instructors/instructors.module';
import { AdminModule } from './admin/admin.module';
import { InstructorauthController } from './authforall/instructorauth/instructorauth.controller';
import { InstructorauthModule } from './authforall/instructorauth/instructorauth.module';
import { AdminauthModule } from './authforall/adminauth/adminauth.module';
import { BlockeduserMiddleware } from './middlewares/blockeduser/blockeduser.middleware';
import { JwtModule } from '@nestjs/jwt';

console.log(process.env.MONGO_URI)
@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Learningmanagement'),AuthModule, UsersModule, InstructorsModule, AdminModule, InstructorauthModule,AdminauthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '15m' },
      }),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(BlockeduserMiddleware)
      .exclude(
        '/auth/student/login',
        '/auth/student/register',
        '/auth/student/sendotp',
        '/auth/student/verifyotp',
        '/auth/student/forgotpassword',
        '/auth/student/resetpassword/:token',

        '/auth/instructor/login',
        '/auth/instructor/register',
        '/auth/instructor/sendotp',
        '/auth/instructor/verifyotp',
        '/auth/instructor/forgotpassword',
        '/auth/instructor/resetpasswordinstructor/:token',

        '/auth/admin/login'
      )
      .forRoutes({ path: 'student/*', method: RequestMethod.ALL })
  }
}
