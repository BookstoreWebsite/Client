import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingCartService } from '../service/shopping-cart/shopping-cart.service';
import { PurchaseItem } from '../models/purchase-item';

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.css']
})
export class PurchaseDetailsComponent implements OnInit {
  purchaseId!: string;

  items: PurchaseItem[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('purchaseId');
    if (!id) {
      this.error = 'Missing purchase id.';
      return;
    }

    this.purchaseId = id;
    this.loadItems();
  }

  private loadItems(): void {
    this.loading = true;
    this.error = null;

    this.shoppingCartService.getPurchaseItems(this.purchaseId).subscribe({
      next: (data: PurchaseItem[]) => {
        this.items = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading purchase items', err);
        this.error = 'Failed to load purchase details.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  get grandTotal(): number {
    return (this.items ?? []).reduce((sum, i) => sum + (i.totalPrice ?? 0), 0);
  }
}
