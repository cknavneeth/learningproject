import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorsidebarComponent } from './instructorsidebar.component';

describe('InstructorsidebarComponent', () => {
  let component: InstructorsidebarComponent;
  let fixture: ComponentFixture<InstructorsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorsidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
