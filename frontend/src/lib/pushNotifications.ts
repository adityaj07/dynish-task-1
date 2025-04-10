import axios from "axios";
import { urlBase64ToUint8Array } from "./utils";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Registering the service worker
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Service Worker or Push Manager not supported");
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );
    console.log("Service Worker registered with scope:", registration.scope);

    // Set up message listener to handle status updates from service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "ORDER_STATUS_UPDATE") {
        // This will be used to trigger UI updates when notifications come in
        window.dispatchEvent(
          new CustomEvent("orderStatusUpdate", {
            detail: event.data.payload,
          })
        );
      }
    });

    return true;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return false;
  }
}

//Request notification permission from the user
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Notifications are not supported in this browser");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Error in requesting for notification permission:", error);
    return false;
  }
}

//Subscribe the user to push notifications
export async function subscribeUserToPush(orderId: string) {
  try {
    // Get worker registration
    const registration = await navigator.serviceWorker.ready;

    //Get Vapid public key from server
    const vapidResponse = await axios.get(`${API_URL}/orders/vapid-public-key`);

    //Convert the key to Uint8Array
    const vapidPublicKey = urlBase64ToUint8Array(
      vapidResponse.data?.vapidPublicKey
    );

    if (!vapidPublicKey) {
      console.error(
        "Invalid VAPID public key received from server:",
        vapidResponse.data
      );
      return false;
    }

    // Check if the user is already subscribed
    let subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey,
    });

    // If no subscription exists, create one
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });
    }

    // Send subscription to server linked with order ID
    await saveSubscription(subscription, orderId);

    return true;
  } catch (error) {
    console.error("Failed to subscribe user to push:", error);
    return false;
  }
}

// save the subscription to the server
async function saveSubscription(
  subscription: PushSubscription,
  orderId: string
) {
  try {
    await axios.post(`${API_URL}/orders/${orderId}/subscription`, subscription);
    console.log("Push subscription saved for order:", orderId);
    return true;
  } catch (err) {
    console.error("Failed to save subscription:", err);
    return false;
  }
}
