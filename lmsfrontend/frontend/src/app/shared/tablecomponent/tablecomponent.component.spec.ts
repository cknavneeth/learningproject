import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablecomponentComponent } from './tablecomponent.component';

describe('TablecomponentComponent', () => {
  let component: TablecomponentComponent;
  let fixture: ComponentFixture<TablecomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablecomponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablecomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
