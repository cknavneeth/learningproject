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
import { GuardGuard } from './authentication/guard/guard.guard';
import { CloudinaryService } from './shared/cloudinary/cloudinary.service';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { EmailService } from './shared/email/email.service';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { WishlistController } from './wishlist/wishlist.controller';
import { WishlistService } from './wishlist/wishlist.service';
import { WishlistModule } from './wishlist/wishlist.module';
import { CategoryController } from './category/controller/category.controller';
import { CategoryService } from './category/service/category.service';
import { CategoryRepository } from './category/repository/category.repository';
import { CategoryModule } from './category/category.module';
import { CouponController } from './coupon/controller/coupon.controller';
import { CouponRepository } from './coupon/repository/coupon.repository';
import { CouponService } from './coupon/service/coupon.service';
import { CouponModule } from './coupon/coupon.module';
import { PaymentController } from './payment/controller/payment.controller';
import { PaymentService } from './payment/service/payment.service';
import { paymentRepository } from './payment/repository/payment.repository';
import { PaymentModule } from './payment/payment.module';
import { MylearningModule } from './mylearning/mylearning.module';


console.log(process.env.MONGO_URI)
@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Learningmanagement'),AuthModule, UsersModule, InstructorsModule, AdminModule, InstructorauthModule,AdminauthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        // signOptions: { expiresIn: '15m' },
        signOptions: { expiresIn: `${configService.get('JWT_MAX_AGE')}` },
      }),
    }),
    CloudinaryModule,
    CartModule,
    WishlistModule,
    CategoryModule,
    CouponModule,
    PaymentModule,
    MylearningModule
  ],
  controllers: [AppController, CartController, CouponController, PaymentController,  ],
  providers: [AppService,GuardGuard, CloudinaryService, EmailService, CouponService, PaymentService ],
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

        '/auth/instructor/inslogin',
        '/auth/instructor/instructorRegister',
        '/auth/instructor/sendotp',
        '/auth/instructor/verifyotp',
        '/auth/instructor/forgotpassword',
        '/auth/instructor/resetpasswordinstructor/:token',

        '/auth/admin/login'
      )
      .forRoutes({ path: 'student/*', method: RequestMethod.ALL })
  }
}
