import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorcomponentComponent } from './instructorcomponent.component';

describe('InstructorcomponentComponent', () => {
  let component: InstructorcomponentComponent;
  let fixture: ComponentFixture<InstructorcomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorcomponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
