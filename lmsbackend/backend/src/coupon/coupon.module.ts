import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schema/coupon.schema';
import { CouponController } from './controller/coupon.controller';
import { COUPON_REPOSITORY, COUPON_SERVICE } from './constants/constant';
import { CouponService } from './service/coupon.service';
import { CouponRepository } from './repository/coupon.repository';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Coupon.name,schema:CouponSchema}])
    ],
    controllers:[CouponController],
    providers:[
        {
            provide:COUPON_SERVICE,
            useClass:CouponService
        },
        {
            provide:COUPON_REPOSITORY,
            useClass:CouponRepository
        },
        CouponService,
        CouponRepository
    ],
    exports:[COUPON_SERVICE,COUPON_REPOSITORY]
})
export class CouponModule {}
