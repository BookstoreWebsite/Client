import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../service/shopping-cart/shopping-cart.service';
import { TokenStorageService } from '../service/auth/token.service';
import { finalize, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  totalPrice = 0;
  isPurchasing = false;

  addressForm = this.fb.group({
    country: ['', [Validators.required, Validators.maxLength(100)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    street: ['', [Validators.required, Validators.maxLength(200)]],
    number: ['', [Validators.required, Validators.maxLength(20)]],
    postalCode: ['', [Validators.required, Validators.maxLength(20)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.totalPrice = this.shoppingCartService.getTotalPriceSnapshot();
    if (this.totalPrice <= 0) this.router.navigate(['/shopping-cart']);
  }

  purchase(): void {
    if (this.isPurchasing) return;

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const userId = this.tokenStorage.getUserId();
    if (!userId) return;

    const address = this.addressForm.value;

    this.isPurchasing = true;

    this.shoppingCartService.createPurchase(userId, address).pipe(
      tap(() => {
        this.shoppingCartService.clear();
      }),
      switchMap(() => this.shoppingCartService.clearShoppingCart(userId)),
      finalize(() => {
        this.isPurchasing = false;
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/purchase-complete']);
      },
      error: (err: any) => {
        console.log('Purchase failed', err);
      }
    });
  }
}
