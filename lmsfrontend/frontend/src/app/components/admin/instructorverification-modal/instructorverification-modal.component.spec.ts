import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorverificationModalComponent } from './instructorverification-modal.component';

describe('InstructorverificationModalComponent', () => {
  let component: InstructorverificationModalComponent;
  let fixture: ComponentFixture<InstructorverificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorverificationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorverificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
