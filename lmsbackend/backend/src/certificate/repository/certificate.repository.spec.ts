import { Test, TestingModule } from '@nestjs/testing';
import { CertificateRepository } from './certificate.repository';

describe('CertificateRepository', () => {
  let service: CertificateRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertificateRepository],
    }).compile();

    service = module.get<CertificateRepository>(CertificateRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
