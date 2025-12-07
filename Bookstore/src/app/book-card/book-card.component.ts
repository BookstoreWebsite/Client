import { Component, Input } from '@angular/core';
import { Book } from '../models/book';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {

  @Input() book!: Book;
  stars: any;

  get starStates(): string[] {
  const rating = this.book?.rating ?? 0;
  const stars: string[] = [];

  for (let i = 1; i <= 5; i++) {
    // koliko je popunjena konkretna zvezda (i)
    // npr. rating = 4.2:
    // i = 1 → 1+
    // i = 4 → 1+
    // i = 5 → 0.2 (delimično)
    const fill = rating - (i - 1);

    if (fill >= 1) {
      stars.push('full');          // potpuno popunjena
    } else if (fill <= 0) {
      stars.push('empty');         // prazna
    } else if (fill <= 0.33) {
      stars.push('quarter');       // malo popunjena (npr 4.1–4.3)
    } else if (fill <= 0.66) {
      stars.push('half');          // pola (npr 4.4–4.6)
    } else {
      stars.push('half-strong');   // skoro puna (npr 4.7–4.9)
    }
  }

  return stars;
}

}
