import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorstudentsComponent } from './instructorstudents.component';

describe('InstructorstudentsComponent', () => {
  let component: InstructorstudentsComponent;
  let fixture: ComponentFixture<InstructorstudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorstudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorstudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
