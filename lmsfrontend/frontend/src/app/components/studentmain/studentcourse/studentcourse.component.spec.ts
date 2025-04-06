import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentcourseComponent } from './studentcourse.component';

describe('StudentcourseComponent', () => {
  let component: StudentcourseComponent;
  let fixture: ComponentFixture<StudentcourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentcourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentcourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
