import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsSelectorComponent } from './questions-selector.component';

describe('QuestionsSelectorComponent', () => {
  let component: QuestionsSelectorComponent;
  let fixture: ComponentFixture<QuestionsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
