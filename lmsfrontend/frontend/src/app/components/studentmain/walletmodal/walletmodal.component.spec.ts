import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletmodalComponent } from './walletmodal.component';

describe('WalletmodalComponent', () => {
  let component: WalletmodalComponent;
  let fixture: ComponentFixture<WalletmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
