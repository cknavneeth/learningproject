import { TestBed } from '@angular/core/testing';

import { SharedemailService } from './sharedemail.service';

describe('SharedemailService', () => {
  let service: SharedemailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedemailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
