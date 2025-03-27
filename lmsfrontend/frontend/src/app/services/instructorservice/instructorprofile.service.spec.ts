import { TestBed } from '@angular/core/testing';

import { InstructorprofileService } from './instructorprofile.service';

describe('InstructorprofileService', () => {
  let service: InstructorprofileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorprofileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
