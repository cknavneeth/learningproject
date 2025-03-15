import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgorpasswordComponent } from './forgorpassword.component';

describe('ForgorpasswordComponent', () => {
  let component: ForgorpasswordComponent;
  let fixture: ComponentFixture<ForgorpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgorpasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgorpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
