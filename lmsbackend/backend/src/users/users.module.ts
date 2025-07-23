import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { user, userSchema } from './users.schema';
import { UserRepository } from './repositories/user/user.repository';
import { AuthenticationModule } from 'src/authentication/auth.module';
import { Course, CourseSchema } from 'src/instructors/courses/course.schema';
import { USER_REPOSITORY, USER_SERVICE } from './constants/user.constant';

export const userRepoProvider={
  provide:USER_REPOSITORY,
  useClass:UserRepository
}

export const userServiceProvider={
  provide:USER_SERVICE,
  useClass:UsersService
}



@Module({
  imports:[MongooseModule.forFeature([{name:user.name,schema:userSchema},{name:Course.name,schema:CourseSchema}]),AuthenticationModule],
  providers: [UsersService,
   UserRepository,
  //  {
  //   provide:USER_REPOSITORY,
  //   useClass:UserRepository
  //  },
  userRepoProvider,
  userServiceProvider
  ],
  controllers: [UsersController],
  exports:[UsersService,UserRepository,MongooseModule,userRepoProvider,userServiceProvider]
})
export class UsersModule {}
