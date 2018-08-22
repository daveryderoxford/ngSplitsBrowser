import { TestBed, inject } from '@angular/core/testing';

import { UserDataService } from './user-data.service';

xdescribe('UserDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserDataService]
    });
  });

  it('should be created', inject([UserDataService], (service: UserDataService) => {
    expect(service).toBeTruthy();
  }));

  it('user data on first login', inject([UserDataService], (service: UserDataService) => {
    expect(service).toBeTruthy();
  }));

  it('user data when not logged in', inject([UserDataService], (service: UserDataService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created', inject([UserDataService], (service: UserDataService) => {
    expect(service).toBeTruthy();
  }));


});
