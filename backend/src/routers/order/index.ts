import { Router } from "express";
import {
  getOrderStatus,
  getVapidPublicKey,
  saveSubscription,
  updateOrderStatus,
} from "../../controllers/orders";

const orderRouter = Router({ mergeParams: true });

// Change the status of the order
orderRouter.patch("/:id/status", updateOrderStatus);

// Get the status of the order
orderRouter.get("/:id/status", getOrderStatus);

// Saving subscription for an order
orderRouter.post("/:id/subscription", saveSubscription);

// Get VAPID public key
orderRouter.get("/vapid-public-key", getVapidPublicKey);

export default orderRouter;
