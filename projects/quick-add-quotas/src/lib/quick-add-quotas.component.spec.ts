import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAddQuotasComponent } from './quick-add-quotas.component';

describe('QuickAddQuotasComponent', () => {
  let component: QuickAddQuotasComponent;
  let fixture: ComponentFixture<QuickAddQuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickAddQuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickAddQuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
