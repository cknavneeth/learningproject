import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorcommunityComponent } from './instructorcommunity.component';

describe('InstructorcommunityComponent', () => {
  let component: InstructorcommunityComponent;
  let fixture: ComponentFixture<InstructorcommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorcommunityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorcommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
