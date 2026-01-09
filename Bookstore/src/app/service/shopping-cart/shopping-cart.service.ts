import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { CartItem } from '../../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private apiUrl = `${environment.apiUrl}/shoppingCart`;

  constructor(private http: HttpClient) { }

  private totalPriceSubject = new BehaviorSubject<number>(0);
  totalPrice$ = this.totalPriceSubject.asObservable();

  setTotalPrice(total: number) {
    this.totalPriceSubject.next(total ?? 0);
  }

  getTotalPriceSnapshot(): number {
    return this.totalPriceSubject.value;
  }

  clear() {
    this.totalPriceSubject.next(0);
  }

  addToCart(shoppingCartUserId: string, productId: string){
    return this.http.post<void>(`${this.apiUrl}/add/${shoppingCartUserId}/${productId}`, {});
  }
  getAllCartItems(shoppingCartUserId: string) : Observable<CartItem[]>{
    return this.http.get<CartItem[]>(`${this.apiUrl}/getAllCartItems/${shoppingCartUserId}`);
  }
  createPurchase(userId: string, address: any){
    return this.http.post<void>(`${this.apiUrl}/createPurchase/${userId}`, address)
  } 
  clearShoppingCart(userId: string)
  {
    return this.http.delete<void>(`${this.apiUrl}/clearShoppingCart/${userId}`)
  }
  incrementItemQuantity(itemId: string){
    return this.http.put<void>(`${this.apiUrl}/incrementItemQuantity/${itemId}`, {});
  }
  decrementItemQuantity(itemId: string){
    return this.http.put<void>(`${this.apiUrl}/decrementItemQuantity/${itemId}`, {});
  }
  removeItem(itemId: string){
    return this.http.delete<void>(`${this.apiUrl}/removeItem/${itemId}`);
  }

}
