import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentquizComponent } from './studentquiz.component';

describe('StudentquizComponent', () => {
  let component: StudentquizComponent;
  let fixture: ComponentFixture<StudentquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentquizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
