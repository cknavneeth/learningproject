import { Test, TestingModule } from '@nestjs/testing';
import { InstructorauthController } from './instructorauth.controller';

describe('InstructorauthController', () => {
  let controller: InstructorauthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstructorauthController],
    }).compile();

    controller = module.get<InstructorauthController>(InstructorauthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
