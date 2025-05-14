import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorreplydialogComponent } from './instructorreplydialog.component';

describe('InstructorreplydialogComponent', () => {
  let component: InstructorreplydialogComponent;
  let fixture: ComponentFixture<InstructorreplydialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorreplydialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorreplydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
