import { Test, TestingModule } from '@nestjs/testing';
import { CouponRepository } from './coupon.repository';

describe('CouponService', () => {
  let service: CouponRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponRepository],
    }).compile();

    service = module.get<CouponRepository>(CouponRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
});
