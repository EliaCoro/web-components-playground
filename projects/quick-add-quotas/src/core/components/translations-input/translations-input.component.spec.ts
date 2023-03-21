import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationsInputComponent } from './translations-input.component';

describe('TranslationsInputComponent', () => {
  let component: TranslationsInputComponent;
  let fixture: ComponentFixture<TranslationsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranslationsInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
