import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorforgotpasswordComponent } from './instructorforgotpassword.component';

describe('InstructorforgotpasswordComponent', () => {
  let component: InstructorforgotpasswordComponent;
  let fixture: ComponentFixture<InstructorforgotpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorforgotpasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorforgotpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
