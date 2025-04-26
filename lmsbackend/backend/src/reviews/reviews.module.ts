import { Module } from '@nestjs/common';
import { Review, ReviewSchema } from './schema/review.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from 'src/authentication/auth.module';
import { ReviewController } from './controller/review.controller';
import { REVIEW_REPOSITORY, REVIEW_SERVICE } from './constants/review.constant';
import { ReviewService } from './service/review.service';
import { ReviewRepository } from './repository/review.repository';
import { user, userSchema } from 'src/users/users.schema';
import { UsersModule } from 'src/users/users.module';
import { CourseProgress, CourseProgressSchema } from 'src/mylearning/schema/course-progress.schema';
import { MylearningModule } from 'src/mylearning/mylearning.module';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Review.name,schema:ReviewSchema},{name:user.name,schema:userSchema},{name:CourseProgress.name,schema:CourseProgressSchema}]),
        AuthenticationModule,
        UsersModule,
        MylearningModule
    ],
    controllers:[ReviewController],
    providers:[
        {
            provide:REVIEW_SERVICE,
            useClass:ReviewService
        },
        {
            provide:REVIEW_REPOSITORY,
            useClass:ReviewRepository
        }
    ],
    exports:[REVIEW_SERVICE,REVIEW_REPOSITORY]
})
export class ReviewsModule {}
