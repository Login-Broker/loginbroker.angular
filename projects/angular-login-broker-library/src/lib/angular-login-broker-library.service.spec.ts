import { TestBed } from '@angular/core/testing';

import { AngularLoginBrokerLibraryService } from './angular-login-broker-library.service';

describe('AngularLoginBrokerLibraryService', () => {
  let service: AngularLoginBrokerLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularLoginBrokerLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
