import { TestBed } from '@angular/core/testing';

import { StudentcertificateService } from './studentcertificate.service';

describe('StudentcertificateService', () => {
  let service: StudentcertificateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentcertificateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
