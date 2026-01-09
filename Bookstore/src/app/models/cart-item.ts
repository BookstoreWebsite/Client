export interface CartItem {
  id: string,
  productId: string;
  productName: string;
  productImageUrl: string;
  productPrice : number;
  quantity: number;
  unitPrice: number;
}