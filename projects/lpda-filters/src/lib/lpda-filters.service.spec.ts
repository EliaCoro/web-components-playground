import { TestBed } from '@angular/core/testing';

import { LpdaFiltersService } from './lpda-filters.service';

describe('LpdaFiltersService', () => {
  let service: LpdaFiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LpdaFiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
