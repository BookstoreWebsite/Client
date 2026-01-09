import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBookReviewsComponent } from './all-book-reviews.component';

describe('AllBookReviewsComponent', () => {
  let component: AllBookReviewsComponent;
  let fixture: ComponentFixture<AllBookReviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllBookReviewsComponent]
    });
    fixture = TestBed.createComponent(AllBookReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
