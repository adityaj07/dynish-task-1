export enum OrderStatus {
  NEW = "NEW",
  COOKING = "COOKING",
  READY = "READY",
  COMPLETED = "COMPLETED",
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
