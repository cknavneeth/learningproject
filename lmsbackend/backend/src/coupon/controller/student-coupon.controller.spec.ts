import { Test, TestingModule } from '@nestjs/testing';
import { StudentCouponController } from './student-coupon.controller';

describe('StudentCouponController', () => {
  let controller: StudentCouponController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentCouponController],
    }).compile();

    controller = module.get<StudentCouponController>(StudentCouponController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
