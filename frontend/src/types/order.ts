export enum OrderStatus {
  NEW = "New Order",
  COOKING = "Cooking Order",
  READY = "Ready Order",
  COMPLETED = "Complete Order",
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imgUrl?: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
}
