import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentquizresultComponent } from './studentquizresult.component';

describe('StudentquizresultComponent', () => {
  let component: StudentquizresultComponent;
  let fixture: ComponentFixture<StudentquizresultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentquizresultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentquizresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
