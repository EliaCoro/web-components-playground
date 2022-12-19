import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpdaDownloadMenuShowcaseComponent } from './lpda-download-menu-showcase.component';

describe('LpdaDownloadMenuShowcaseComponent', () => {
  let component: LpdaDownloadMenuShowcaseComponent;
  let fixture: ComponentFixture<LpdaDownloadMenuShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpdaDownloadMenuShowcaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpdaDownloadMenuShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
