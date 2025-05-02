import { Test, TestingModule } from '@nestjs/testing';
import { CommunityGateway } from './community.gateway';

describe('CommunityGateway', () => {
  let gateway: CommunityGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityGateway],
    }).compile();

    gateway = module.get<CommunityGateway>(CommunityGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
