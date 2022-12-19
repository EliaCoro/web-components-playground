import { TestBed } from '@angular/core/testing';

import { LpdaDownloadMenuService } from './lpda-download-menu.service';

describe('LpdaDownloadMenuService', () => {
  let service: LpdaDownloadMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LpdaDownloadMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
