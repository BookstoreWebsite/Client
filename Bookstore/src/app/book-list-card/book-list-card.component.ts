import { Component, Input } from '@angular/core';
import { Book } from '../models/book';

@Component({
  selector: 'app-book-list-card',
  templateUrl: './book-list-card.component.html',
  styleUrls: ['./book-list-card.component.css']
})
export class BookListCardComponent {
  @Input() book!: Book;
}
