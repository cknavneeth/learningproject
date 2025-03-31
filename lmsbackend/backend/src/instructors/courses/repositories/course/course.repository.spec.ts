import { Test, TestingModule } from '@nestjs/testing';
import { CourseRepository } from './course.repository';

describe('CourseService', () => {
  let service: CourseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseRepository],
    }).compile();

    service = module.get<CourseRepository>(CourseRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
