import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitychatComponent } from './communitychat.component';

describe('CommunitychatComponent', () => {
  let component: CommunitychatComponent;
  let fixture: ComponentFixture<CommunitychatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunitychatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunitychatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
