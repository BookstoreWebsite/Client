import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishedBooksComponent } from './wished-books.component';

describe('WishedBooksComponent', () => {
  let component: WishedBooksComponent;
  let fixture: ComponentFixture<WishedBooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WishedBooksComponent]
    });
    fixture = TestBed.createComponent(WishedBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
