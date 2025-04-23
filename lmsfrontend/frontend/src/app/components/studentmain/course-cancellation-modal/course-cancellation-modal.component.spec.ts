import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCancellationModalComponent } from './course-cancellation-modal.component';

describe('CourseCancellationModalComponent', () => {
  let component: CourseCancellationModalComponent;
  let fixture: ComponentFixture<CourseCancellationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCancellationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCancellationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
