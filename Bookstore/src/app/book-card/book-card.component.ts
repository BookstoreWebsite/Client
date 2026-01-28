import { Component, Input } from '@angular/core';
import { Book } from '../models/book';
import { ShoppingCartService } from '../service/shopping-cart/shopping-cart.service';
import { TokenStorageService } from '../service/auth/token.service';
import { User } from '../models/user';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {

  @Input() book!: Book;
  stars: any;
  showAddedMessage = false;
  @Input() currentUser!: User | null;

  constructor(private shoppingCartService: ShoppingCartService, private tokenStorage: TokenStorageService){}

  get starStates(): string[] {
  const rating = this.book?.rating ?? 0;
  const stars: string[] = [];

  for (let i = 1; i <= 5; i++) {

    const fill = rating - (i - 1);

    if (fill >= 1) {
      stars.push('full');          
    } else if (fill <= 0) {
      stars.push('empty');         
    } else if (fill <= 0.33) {
      stars.push('quarter');       
    } else if (fill <= 0.66) {
      stars.push('half');          
    } else {
      stars.push('half-strong');   
    }
  }

  return stars;
}
  addToCart(book: any): void {
  if ((book?.amount ?? 0) <= 0) return;

  const userId = this.tokenStorage.getUserId();
  const productId = String(book.id);

  this.shoppingCartService.addToCart(userId, productId).subscribe({
    next: () => {
      this.showAddedMessage = true;
      setTimeout(() => (this.showAddedMessage = false), 2000);
    },
    error: (err) => console.error('Add to cart error:', err)
  });
}



}
