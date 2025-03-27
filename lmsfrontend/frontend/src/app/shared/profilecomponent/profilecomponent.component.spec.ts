import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilecomponentComponent } from './profilecomponent.component';

describe('ProfilecomponentComponent', () => {
  let component: ProfilecomponentComponent;
  let fixture: ComponentFixture<ProfilecomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilecomponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilecomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
