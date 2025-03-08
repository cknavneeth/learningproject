import { TestBed } from '@angular/core/testing';

import { InstructorauthserviceService } from './instructorauthservice.service';

describe('InstructorauthserviceService', () => {
  let service: InstructorauthserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstructorauthserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
