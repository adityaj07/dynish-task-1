import { Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import { sendNotification } from "../../services/notificationService";
import { StatusCodes } from "../../lib/StatusCodes";
import { env } from "../../utils/validateEnv";

const orderRouter = Router({ mergeParams: true });

// Change the status of the order
orderRouter.patch("/:id/status", async (req: Request, res: Response) => {
  const { status } = req.body;
  const orderId = Number(req.params.id);

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: status },
      include: { items: true },
    });

    // Send notification about status update
    await sendNotification(orderId, {
      title: "Order Status Updated",
      body: `Your order is now ${status}`,
      data: {
        orderId: orderId,
        status: status,
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Saving subscription for an order
orderRouter.post("/:id/subscription", async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  const { endpoint, keys, expirationTime } = req.body;

  try {
    const existingSub = await prisma.pushSubscription.findUnique({
      where: {
        endpoint,
      },
    });

    if (existingSub) {
      // Update the orderId if needed
      if (existingSub.orderId !== orderId) {
        await prisma.pushSubscription.update({
          where: { id: existingSub.id },
          data: { orderId },
        });
      }
      res.status(StatusCodes.OK).json({ success: true });
      return;
    }

    await prisma.pushSubscription.create({
      data: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        expirationTime,
        orderId,
      },
    });
    res.status(StatusCodes.OK).json({ success: true });
  } catch (error) {
    console.error("Subscription error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to save subscription" });
  }
});

// Get VAPID public key
orderRouter.get("/vapid-public-key", (req: Request, res: Response) => {
  res.json({ publicKey: env.VAPID_PUBLIC_KEY });
});

export default orderRouter;
