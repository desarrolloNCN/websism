import { TestBed } from '@angular/core/testing';

import { ObspyAPIService } from './obspy-api.service';

describe('ObspyAPIService', () => {
  let service: ObspyAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObspyAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
