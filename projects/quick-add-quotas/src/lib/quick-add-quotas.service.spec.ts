import { TestBed } from '@angular/core/testing';

import { QuickAddQuotasService } from './quick-add-quotas.service';

describe('QuickAddQuotasService', () => {
  let service: QuickAddQuotasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuickAddQuotasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
