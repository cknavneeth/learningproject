import { Module } from '@nestjs/common';
import { CourseProgress, CourseProgressSchema } from './schema/course-progress.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from 'src/instructors/courses/course.schema';
import { AuthenticationModule } from 'src/authentication/auth.module';
import { MylearningController } from './controller/mylearning.controller';
import { MYLEARNING_REPOSITORY, MYLEARNING_SERVICE } from './constants/mylearning.constants';
import { MylearningService } from './service/mylearning.service';
import { MylearningRepository } from './repository/mylearning.repository';
import { Payment, PaymentSchema } from 'src/payment/schema/payment.schema';

@Module({
    imports:[
        MongooseModule.forFeature([{name:CourseProgress.name,schema:CourseProgressSchema},{name:Course.name,schema:CourseSchema},{ name: Payment.name, schema: PaymentSchema }]),
        AuthenticationModule
    ],
    controllers:[MylearningController],
    providers:[
        {
            provide:MYLEARNING_SERVICE,
            useClass:MylearningService
        },
        {
            provide:MYLEARNING_REPOSITORY,
            useClass:MylearningRepository
        }
    ],
    exports:[MYLEARNING_SERVICE,MYLEARNING_REPOSITORY,MongooseModule]
    
})
export class MylearningModule {}
