import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizmodalComponent } from './quizmodal.component';

describe('QuizmodalComponent', () => {
  let component: QuizmodalComponent;
  let fixture: ComponentFixture<QuizmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
