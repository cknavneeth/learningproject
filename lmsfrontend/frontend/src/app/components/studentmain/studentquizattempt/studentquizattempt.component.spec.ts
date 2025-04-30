import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentquizattemptComponent } from './studentquizattempt.component';

describe('StudentquizattemptComponent', () => {
  let component: StudentquizattemptComponent;
  let fixture: ComponentFixture<StudentquizattemptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentquizattemptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentquizattemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
