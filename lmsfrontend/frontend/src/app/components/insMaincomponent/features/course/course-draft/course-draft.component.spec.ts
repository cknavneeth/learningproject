import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDraftComponent } from './course-draft.component';

describe('CourseDraftComponent', () => {
  let component: CourseDraftComponent;
  let fixture: ComponentFixture<CourseDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDraftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
