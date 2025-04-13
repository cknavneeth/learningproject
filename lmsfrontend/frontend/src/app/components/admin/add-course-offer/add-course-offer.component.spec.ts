import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourseOfferComponent } from './add-course-offer.component';

describe('AddCourseOfferComponent', () => {
  let component: AddCourseOfferComponent;
  let fixture: ComponentFixture<AddCourseOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCourseOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCourseOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
