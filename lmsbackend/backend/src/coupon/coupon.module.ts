import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schema/coupon.schema';
import { CouponController } from './controller/coupon.controller';
import { COUPON_REPOSITORY, COUPON_SERVICE, STUDENT_COUPON_SERVICE } from './constants/constant';
import { CouponService } from './service/coupon.service';
import { CouponRepository } from './repository/coupon.repository';
import { StudentCouponController } from './controller/student-coupon.controller';
import { StudentCouponService } from './service/student-coupon.service';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Coupon.name,schema:CouponSchema}])
    ],
    controllers:[CouponController, StudentCouponController],
    providers:[
        {
            provide:COUPON_SERVICE,
            useClass:CouponService
        },
        {
            provide:COUPON_REPOSITORY,
            useClass:CouponRepository
        },
        {
              provide:STUDENT_COUPON_SERVICE,
              useClass:StudentCouponService
        },
        
        CouponService,
        CouponRepository,
        StudentCouponService
    ],
    exports:[COUPON_SERVICE,COUPON_REPOSITORY,STUDENT_COUPON_SERVICE]
})
export class CouponModule {}
