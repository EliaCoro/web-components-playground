import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAddQuotasPageComponent } from './quick-add-quotas-page.component';

describe('QuickAddQuotasPageComponent', () => {
  let component: QuickAddQuotasPageComponent;
  let fixture: ComponentFixture<QuickAddQuotasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickAddQuotasPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickAddQuotasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
