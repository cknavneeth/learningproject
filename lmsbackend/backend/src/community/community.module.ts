import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema, Message, MessageSchema } from './schema/community.schema';
import { AuthenticationModule } from 'src/authentication/auth.module';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { CommunityService } from './service/community.service';
import { CommunityGateway } from './gateway/community/community.gateway';
import { Payment, PaymentSchema } from 'src/payment/schema/payment.schema';
import { Course, CourseSchema } from 'src/instructors/courses/course.schema';

@Module({
    imports:[ MongooseModule.forFeature([{name:Community.name,schema:CommunitySchema},{name:Message.name,schema:MessageSchema},{name:Payment.name,schema:PaymentSchema},{name:Course.name,schema:CourseSchema}]), AuthenticationModule,CloudinaryModule],
    providers:[
        CommunityService,
        {
           provide:'COMMUNITY_SERVICE',
           useClass:CommunityService
        },
        CommunityGateway
    ],
    exports:[CommunityService]
})
export class CommunityModule {}
