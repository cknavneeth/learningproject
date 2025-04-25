import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundconfirmationmodalComponent } from './refundconfirmationmodal.component';

describe('RefundconfirmationmodalComponent', () => {
  let component: RefundconfirmationmodalComponent;
  let fixture: ComponentFixture<RefundconfirmationmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundconfirmationmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundconfirmationmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
