import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { instructorguardGuard } from './instructorguard.guard';

describe('instructorguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => instructorguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
