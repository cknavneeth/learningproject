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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Course.name, schema: CourseSchema }
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
    ConfigModule
  ],
  controllers:[CartController],
  providers:[CartService,CartRepository],
  exports: [CartService, CartRepository],
})
export class CartModule {}
