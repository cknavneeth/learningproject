import { Test, TestingModule } from '@nestjs/testing';
import { StudentCouponService } from './student-coupon.service';

describe('StudentCouponService', () => {
  let service: StudentCouponService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentCouponService],
    }).compile();

    service = module.get<StudentCouponService>(StudentCouponService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
