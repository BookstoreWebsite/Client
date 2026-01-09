import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../service/shopping-cart/shopping-cart.service';
import { TokenStorageService } from '../service/auth/token.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  totalPrice = 0;

  addressForm = this.fb.group({
    country: ['', [Validators.required, Validators.maxLength(100)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    street: ['', [Validators.required, Validators.maxLength(200)]],
    number: ['', [Validators.required, Validators.maxLength(20)]],
    postalCode: ['', [Validators.required, Validators.maxLength(20)]],
  });

  constructor(private fb: FormBuilder, private router: Router, private shoppingCartService: ShoppingCartService, private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    this.totalPrice = this.shoppingCartService.getTotalPriceSnapshot();
    if (this.totalPrice <= 0) this.router.navigate(['/shopping-cart']);
  }

  purchase(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const address = this.addressForm.value;
    console.log('PURCHASE', { address, totalPrice: this.totalPrice });

    this.shoppingCartService.createPurchase(this.tokenStorage.getUserId(), address).subscribe({
      next: (res: any) => {
        console.log('Purchase successful', res);
        this.shoppingCartService.clear();
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.log('Purchase failed', err)
      }
    });
    this.shoppingCartService.clearShoppingCart(this.tokenStorage.getUserId()).subscribe({
      next: (res: any) => {
        console.log('Cart cleared', res);
      },
      error: (err: any) => {
        console.log('Items not found', err)
      }
    })
    
  }
}