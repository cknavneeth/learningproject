import { Test, TestingModule } from '@nestjs/testing';
import { AdminRepository } from './admin.repository';

describe('AdminService', () => {
  let service: AdminRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminRepository],
    }).compile();

    service = module.get<AdminRepository>(AdminRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
