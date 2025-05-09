import { OrderStatus } from "@prisma/client";
import webpush from "web-push";
import { prisma } from "../lib/prisma";
import { StatusCodes } from "../lib/StatusCodes";
import { env } from "../utils/validateEnv";

webpush.setVapidDetails(
  env.VAPID_SUBJECT,
  env.VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY
);

export const sendNotification = async (orderId: number, payload: any) => {
  try {
    // Get all the subs for this order
    const subs = await prisma.pushSubscription.findMany({
      where: {
        orderId,
      },
    });

    if (subs.length === 0) {
      console.log(`No subscriptions found for order ID: ${orderId}`);
      return { success: true, message: "No subscriptions to notify" };
    }

    // send notifs to each sub
    const notificationPromises = subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify(payload)
        );
        return { success: true, endpoint: sub.endpoint };
      } catch (error) {
        console.error("Error sending notification:", error);
        // If subscription is invalid or expired, remove it
        if (
          typeof error === "object" &&
          error &&
          "statusCode" in error &&
          (error.statusCode === StatusCodes.GONE ||
            error.statusCode === StatusCodes.NOT_FOUND)
        ) {
          await prisma.pushSubscription.delete({
            where: { id: sub.id },
          });
          return {
            success: false,
            removed: true,
            endpoint: sub.endpoint,
          };
        }
        return { success: false, endpoint: sub.endpoint };
      }
    });

    await Promise.all(notificationPromises);
    return { success: true };
  } catch (error) {
    console.error("Failed to send notifications:", error);
    return { success: false, error };
  }
};

export const getStatusUpdateMessage = (status: OrderStatus): string => {
  switch (status) {
    case "NEW":
      return "Your order has been received";
    case "COOKING":
      return "Your order is now being prepared";
    case "READY":
      return "Your order is ready for pickup";
    case "COMPLETED":
      return "Your order has been completed";
    default:
      return "Your order status has been updated";
  }
};
