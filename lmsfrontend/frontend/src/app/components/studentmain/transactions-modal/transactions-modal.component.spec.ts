import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsModalComponent } from './transactions-modal.component';

describe('TransactionsModalComponent', () => {
  let component: TransactionsModalComponent;
  let fixture: ComponentFixture<TransactionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
