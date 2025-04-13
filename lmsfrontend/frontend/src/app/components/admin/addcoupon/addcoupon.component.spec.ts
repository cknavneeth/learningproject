import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcouponComponent } from './addcoupon.component';

describe('AddcouponComponent', () => {
  let component: AddcouponComponent;
  let fixture: ComponentFixture<AddcouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddcouponComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddcouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
