import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerOptionsQuotasComponent } from './answer-options-quotas.component';

describe('AnswerOptionsQuotasComponent', () => {
  let component: AnswerOptionsQuotasComponent;
  let fixture: ComponentFixture<AnswerOptionsQuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnswerOptionsQuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerOptionsQuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
