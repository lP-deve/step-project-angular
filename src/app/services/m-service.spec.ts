import { TestBed } from '@angular/core/testing';

import { MService } from './m-service';

describe('MService', () => {
  let service: MService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
