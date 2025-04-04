import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursedetailmodalComponent } from './coursedetailmodal.component';

describe('CoursedetailmodalComponent', () => {
  let component: CoursedetailmodalComponent;
  let fixture: ComponentFixture<CoursedetailmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursedetailmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursedetailmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
