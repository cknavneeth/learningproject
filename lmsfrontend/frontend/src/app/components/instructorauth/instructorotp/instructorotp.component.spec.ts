import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorotpComponent } from './instructorotp.component';

describe('InstructorotpComponent', () => {
  let component: InstructorotpComponent;
  let fixture: ComponentFixture<InstructorotpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorotpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
