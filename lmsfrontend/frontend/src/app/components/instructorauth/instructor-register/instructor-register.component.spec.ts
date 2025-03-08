import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorRegisterComponent } from './instructor-register.component';

describe('InstructorRegisterComponent', () => {
  let component: InstructorRegisterComponent;
  let fixture: ComponentFixture<InstructorRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
