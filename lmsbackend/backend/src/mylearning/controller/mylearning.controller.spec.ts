import { Test, TestingModule } from '@nestjs/testing';
import { MylearningController } from './mylearning.controller';

describe('MylearningController', () => {
  let controller: MylearningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MylearningController],
    }).compile();

    controller = module.get<MylearningController>(MylearningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
