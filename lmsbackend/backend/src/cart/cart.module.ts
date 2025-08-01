import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartRepository } from './repositories/cart/cart.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.schema';
import { Course, CourseSchema } from 'src/instructors/courses/course.schema';
import { CartController } from './cart.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationModule } from '../authentication/auth.module';
import { user, userSchema } from 'src/users/users.schema';
import { UsersModule } from 'src/users/users.module';
import { CART_REPOSITORY } from './constants/constant';
import { PaymentModule } from 'src/payment/payment.module';
import { coursePurchased, coursepurchaseSchema } from 'src/payment/schema/purchased.schema';

export const cartRepoProvider={
    provide:CART_REPOSITORY,
    useClass:CartRepository
}

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Course.name, schema: CourseSchema },
      {name:user.name,schema:userSchema},
      {name:coursePurchased.name,schema:coursepurchaseSchema}
    ]),
    AuthenticationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    ConfigModule,
    UsersModule,
    
  ],
  controllers:[CartController],
  providers:[CartService,CartRepository,
    // {
    //   provide:CART_REPOSITORY,
    //   useClass: CartRepository
    // }
    cartRepoProvider
  ],
  exports: [CartService, CartRepository,cartRepoProvider],
})
export class CartModule {}
