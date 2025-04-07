import { Test, TestingModule } from '@nestjs/testing';
import { WishlistRepository } from './wishlist.repository';

describe('WishlistRepository', () => {
  let service: WishlistRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishlistRepository],
    }).compile();

    service = module.get<WishlistRepository>(WishlistRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
