import { TestBed } from '@angular/core/testing';

import { UserDefinedListService } from './user-defined-list.service';

describe('UserDefinedListService', () => {
  let service: UserDefinedListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDefinedListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
