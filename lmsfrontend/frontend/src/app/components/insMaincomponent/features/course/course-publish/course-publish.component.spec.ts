import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePublishComponent } from './course-publish.component';

describe('CoursePublishComponent', () => {
  let component: CoursePublishComponent;
  let fixture: ComponentFixture<CoursePublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePublishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursePublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
