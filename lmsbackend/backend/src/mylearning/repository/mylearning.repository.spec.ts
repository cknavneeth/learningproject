import { Test, TestingModule } from '@nestjs/testing';
import { MylearningRepository } from './mylearning.repository';

describe('MylearningService', () => {
  let service: MylearningRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MylearningRepository],
    }).compile();

    service = module.get<MylearningRepository>(MylearningRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
