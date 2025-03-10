import { TestBed } from '@angular/core/testing';

import { TokenserviceService } from './tokenservice.service';

describe('TokenserviceService', () => {
  let service: TokenserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
