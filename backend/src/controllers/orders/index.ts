import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { StatusCodes } from "../../lib/StatusCodes";
import {
  getStatusUpdateMessage,
  sendNotification,
} from "../../services/notificationService";

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const orderId = Number(req.params.id);

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: status },
      include: { items: true },
    });

    if (!updatedOrder) {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Order not found" });
      return;
    }

    // Send notification about status update
    await sendNotification(orderId, {
      title: "Order Status Updated",
      body: `${getStatusUpdateMessage(status)}`,
      data: {
        orderId: orderId,
        status: status,
      },
    });

    res.status(StatusCodes.OK).json(updatedOrder);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update order status" });
  }
};

export const getOrderStatus = async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { orderStatus: true },
    });

    if (!order) {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Order not found" });
      return;
    }

    res.status(StatusCodes.OK).json(order);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch order status" });
  }
};

export const saveSubscription = async (req: Request, res: Response) => {
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
};

export const getVapidPublicKey = async (req: Request, res: Response) => {
  try {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "VAPID public key not found" });
      return;
    }
    res.status(StatusCodes.OK).json({ vapidPublicKey });
  } catch (error) {
    console.error("Error fetching VAPID public key:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch VAPID public key" });
  }
};
