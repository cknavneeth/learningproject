import { Test, TestingModule } from '@nestjs/testing';
import { InstructorRepository } from './instructor.repository';

describe('InstructorService', () => {
  let service: InstructorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstructorRepository],
    }).compile();

    service = module.get<InstructorRepository>(InstructorRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
