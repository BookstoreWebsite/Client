import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-complete',
  templateUrl: './purchase-complete.component.html',
  styleUrls: ['./purchase-complete.component.css']
})
export class PurchaseCompleteComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
