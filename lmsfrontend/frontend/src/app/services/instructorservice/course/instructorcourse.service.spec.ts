import { TestBed } from '@angular/core/testing';

import { InstructorcourseService } from './instructorcourse.service';

describe('InstructorcourseService', () => {
  let service: InstructorcourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorcourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
