import { OrderStatus } from "@/types/order";
import completedAnimation from "../../public/completed-order.json";
import cookingAnimation from "../../public/cooking-order.json";
import readyAnimation from "../../public/ready-order.json";
import receivedAnimation from "../../public/received-order.json";

export function getStatusIndex(status: OrderStatus): number {
  const statuses = [
    OrderStatus.NEW,
    OrderStatus.COOKING,
    OrderStatus.READY,
    OrderStatus.COMPLETED,
  ];
  return statuses.indexOf(status);
}

export function getShortStatus(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.NEW:
      return "Received";
    case OrderStatus.COOKING:
      return "Cooking";
    case OrderStatus.READY:
      return "Ready";
    case OrderStatus.COMPLETED:
      return "Completed";
  }
}

export const getStatusTitle = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.NEW:
      return "Order Received";
    case OrderStatus.COOKING:
      return "Cooking in Progress";
    case OrderStatus.READY:
      return "Ready for Pickup";
    case OrderStatus.COMPLETED:
      return "Enjoy Your Meal!";
  }
};

export const getAnimationData = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.NEW:
      return receivedAnimation;
    case OrderStatus.COOKING:
      return cookingAnimation;
    case OrderStatus.READY:
      return readyAnimation;
    case OrderStatus.COMPLETED:
      return completedAnimation;
    default:
      return receivedAnimation;
  }
};

export const getStatusDescription = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.NEW:
      return "We've received your order and started preparing it.";
    case OrderStatus.COOKING:
      return "Our chef is preparing your delicious meal with care.";
    case OrderStatus.READY:
      return "Your order is ready! Please collect it from the counter.";
    case OrderStatus.COMPLETED:
      return "Thank you for dining with us. Hope to see you again soon!";
  }
};
