import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpdaDownloadMenuComponent } from './lpda-download-menu.component';

describe('LpdaDownloadMenuComponent', () => {
  let component: LpdaDownloadMenuComponent;
  let fixture: ComponentFixture<LpdaDownloadMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpdaDownloadMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpdaDownloadMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
