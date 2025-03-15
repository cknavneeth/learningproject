import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationcomponentComponent } from './confirmationcomponent.component';

describe('ConfirmationcomponentComponent', () => {
  let component: ConfirmationcomponentComponent;
  let fixture: ComponentFixture<ConfirmationcomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationcomponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
