import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentcommunityComponent } from './studentcommunity.component';

describe('StudentcommunityComponent', () => {
  let component: StudentcommunityComponent;
  let fixture: ComponentFixture<StudentcommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentcommunityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentcommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
