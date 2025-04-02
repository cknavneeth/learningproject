import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursecreationComponent } from './coursecreation.component';

describe('CoursecreationComponent', () => {
  let component: CoursecreationComponent;
  let fixture: ComponentFixture<CoursecreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursecreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursecreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
