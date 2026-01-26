import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedReviewComponent } from './reported-review.component';

describe('ReportedReviewComponent', () => {
  let component: ReportedReviewComponent;
  let fixture: ComponentFixture<ReportedReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportedReviewComponent]
    });
    fixture = TestBed.createComponent(ReportedReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
