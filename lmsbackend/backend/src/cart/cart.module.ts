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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Course.name, schema: CourseSchema },
      {name:user.name,schema:userSchema}
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
    UsersModule
  ],
  controllers:[CartController],
  providers:[CartService,CartRepository,
    {
      provide:CART_REPOSITORY,
      useClass: CartRepository
    }
  ],
  exports: [CartService, CartRepository],
})
export class CartModule {}
