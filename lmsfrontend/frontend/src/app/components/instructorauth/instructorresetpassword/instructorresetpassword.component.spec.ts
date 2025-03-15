import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorresetpasswordComponent } from './instructorresetpassword.component';

describe('InstructorresetpasswordComponent', () => {
  let component: InstructorresetpasswordComponent;
  let fixture: ComponentFixture<InstructorresetpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorresetpasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorresetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
