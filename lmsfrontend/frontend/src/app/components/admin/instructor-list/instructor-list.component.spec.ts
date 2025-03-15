import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorListComponent } from './instructor-list.component';

describe('InstructorListComponent', () => {
  let component: InstructorListComponent;
  let fixture: ComponentFixture<InstructorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
