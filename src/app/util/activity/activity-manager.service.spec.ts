import { TestBed, inject } from '@angular/core/testing';

import { ActivityManagerService } from './activity-manager.service';

describe('ActivityManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivityManagerService]
    });
  });

  it('should be created', inject([ActivityManagerService], (service: ActivityManagerService) => {
    expect(service).toBeTruthy();
  }));
});
