import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionEndSetupComponent } from './action-end-setup.component';

describe('ActionEndSetupComponent', () => {
  let component: ActionEndSetupComponent;
  let fixture: ComponentFixture<ActionEndSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionEndSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionEndSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
