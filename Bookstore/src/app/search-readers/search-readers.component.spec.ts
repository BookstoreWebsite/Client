import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchReadersComponent } from './search-readers.component';

describe('SearchReadersComponent', () => {
  let component: SearchReadersComponent;
  let fixture: ComponentFixture<SearchReadersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchReadersComponent]
    });
    fixture = TestBed.createComponent(SearchReadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
