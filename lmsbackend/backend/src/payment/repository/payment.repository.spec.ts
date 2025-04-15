import { Test, TestingModule } from '@nestjs/testing';
import { paymentRepository } from './payment.repository';

describe('PaymentService', () => {
  let service: paymentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [paymentRepository],
    }).compile();

    service = module.get<paymentRepository>(paymentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
