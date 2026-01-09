import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { ShoppingCartService } from '../service/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() changed = new EventEmitter<void>();

  defaultImage = 'assets/default-book.png';

  constructor(private shoppingCartService: ShoppingCartService) {}

  incrementQuantity(itemId: string): void {
    this.shoppingCartService.incrementItemQuantity(itemId).subscribe({
      next: (res: any) => {
        this.changed.emit();
        console.log("Increased item quantity ", res);
      },
      error: (err: any) => {
        console.log("Error while increasing quantity ", err);
      }
    })
  }

  decrementQuantity(itemId: string): void {
    this.shoppingCartService.decrementItemQuantity(itemId).subscribe({
      next: (res: any) => {
        this.changed.emit();
        console.log("Decreased item quantity ", res);
      },
      error: (err: any) => {
        console.log("Error while decreasing quantity ", err);
      }
    })
  }

  removeItem(itemId: string): void {
    this.shoppingCartService.removeItem(itemId).subscribe({
      next: (res: any) => {
        this.changed.emit();
        console.log("Removed item ", res);
      },
      error: (err: any) => {
        console.log("Error while removing item ", err);
      }
    })
  }

}
