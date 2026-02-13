import { TestBed } from '@angular/core/testing';

import { AllRooms } from './all-rooms';

describe('AllRooms', () => {
  let service: AllRooms;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllRooms);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
