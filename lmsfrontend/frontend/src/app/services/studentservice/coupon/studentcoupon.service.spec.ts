import { TestBed } from '@angular/core/testing';

import { StudentcouponService } from './studentcoupon.service';

describe('StudentcouponService', () => {
  let service: StudentcouponService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentcouponService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
