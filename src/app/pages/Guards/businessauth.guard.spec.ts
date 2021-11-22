import { TestBed } from '@angular/core/testing';

import { BusinessauthGuard } from './businessauth.guard';

describe('BusinessauthGuard', () => {
  let guard: BusinessauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BusinessauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
