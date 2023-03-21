import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectQuotaMembersComponent } from './select-quota-members.component';

describe('SelectQuotaMembersComponent', () => {
  let component: SelectQuotaMembersComponent;
  let fixture: ComponentFixture<SelectQuotaMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectQuotaMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectQuotaMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
