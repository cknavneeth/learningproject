import { Test, TestingModule } from '@nestjs/testing';
import { InstructorauthService } from './instructorauth.service';

describe('InstructorauthService', () => {
  let service: InstructorauthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstructorauthService],
    }).compile();

    service = module.get<InstructorauthService>(InstructorauthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
