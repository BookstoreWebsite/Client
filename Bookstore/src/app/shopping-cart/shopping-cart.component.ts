import { Component, OnInit } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { ShoppingCartService } from '../service/shopping-cart/shopping-cart.service';
import { TokenStorageService } from '../service/auth/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  items: CartItem[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private shoppingCartService: ShoppingCartService, private tokenStorage: TokenStorageService, private router: Router) {}

  ngOnInit(): void {
   this.loadCart();
  }

  loadCart(): void {
    const userId = this.tokenStorage.getUserId();
    this.isLoading = true;
    this.errorMessage = null;

    this.shoppingCartService.getAllCartItems(userId).subscribe({
      next: (data: CartItem[]) => {
        this.items = data ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load shopping cart.';
        this.isLoading = false;
      }
    })
  }

  get totalPrice(): number {
  return this.items.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );
}

goToPayment(): void {
  this.shoppingCartService.setTotalPrice(this.totalPrice);

  this.router.navigate(['/payment']);
}
}
