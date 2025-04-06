import { Test, TestingModule } from '@nestjs/testing';
import { CartRepository } from './cart.repository';

describe('CartService', () => {
  let service: CartRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartRepository],
    }).compile();

    service = module.get<CartRepository>(CartRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
