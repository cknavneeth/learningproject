import { Test, TestingModule } from '@nestjs/testing';
import { ReviewRepository } from './review.repository';

describe('ReviewRepository', () => {
  let service: ReviewRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewRepository],
    }).compile();

    service = module.get<ReviewRepository>(ReviewRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
