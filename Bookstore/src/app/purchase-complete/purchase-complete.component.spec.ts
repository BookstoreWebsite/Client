import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCompleteComponent } from './purchase-complete.component';

describe('PurchaseCompleteComponent', () => {
  let component: PurchaseCompleteComponent;
  let fixture: ComponentFixture<PurchaseCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseCompleteComponent]
    });
    fixture = TestBed.createComponent(PurchaseCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
