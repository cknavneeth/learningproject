import { Module } from '@nestjs/common';
import { WishlistRepository } from './repositories/wishlist/wishlist.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Wishlist, WishlistSchema } from './wishlist.schema';
import { Course, CourseSchema } from 'src/instructors/courses/course.schema';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { CoursesModule } from 'src/instructors/courses/courses.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationModule } from 'src/authentication/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Wishlist.name, schema: WishlistSchema },
        { name: Course.name, schema: CourseSchema }
    ]),
    CoursesModule,
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
 controllers:[WishlistController],
  providers: [WishlistService,WishlistRepository],
  exports: [WishlistService,WishlistRepository],

})
export class WishlistModule {}
