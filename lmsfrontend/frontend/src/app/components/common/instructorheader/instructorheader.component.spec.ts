import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorheaderComponent } from './instructorheader.component';

describe('InstructorheaderComponent', () => {
  let component: InstructorheaderComponent;
  let fixture: ComponentFixture<InstructorheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorheaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
