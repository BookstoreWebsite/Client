import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedCommentComponent } from './reported-comment.component';

describe('ReportedCommentComponent', () => {
  let component: ReportedCommentComponent;
  let fixture: ComponentFixture<ReportedCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportedCommentComponent]
    });
    fixture = TestBed.createComponent(ReportedCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
