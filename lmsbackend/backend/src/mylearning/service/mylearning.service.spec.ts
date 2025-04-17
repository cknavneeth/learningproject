import { Test, TestingModule } from '@nestjs/testing';
import { MylearningService } from './mylearning.service';

describe('MylearningService', () => {
  let service: MylearningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MylearningService],
    }).compile();

    service = module.get<MylearningService>(MylearningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
