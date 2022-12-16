import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LpdaFiltersComponent } from './lpda-filters.component';

describe('LpdaFiltersComponent', () => {
  let component: LpdaFiltersComponent;
  let fixture: ComponentFixture<LpdaFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LpdaFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LpdaFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
