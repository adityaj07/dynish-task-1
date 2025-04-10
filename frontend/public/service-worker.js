self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    console.log("Push notification received:", data);

    // Show the notification to the user
    const title = data.title || "Order Update";
    const options = {
      body: data.body || "Your order status has been updated",
      icon: "/dynish-logo.png",
      badge: "dynish-logo.png",
    };

    event.waitUntil(
      self.registration
        .showNotification(title, options)
        .then(() => {
          // Send message to all client windows
          return self.clients.matchAll({ type: "window" });
        })
        .then((clients) => {
          if (clients && clients.length) {
            // Send message to all clients
            clients.forEach((client) => {
              client.postMessage({
                type: "ORDER_STATUS_UPDATE",
                payload: data.data, // Important: This contains orderId and status
              });
            });
          }
        })
    );
  } catch (error) {
    console.error("Error processing push notification:", error);
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // This looks up all windows clients
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientsArr) => {
      // If a window client is available, focus it
      const hadWindowToFocus = clientsArr.some((windowClient) => {
        if (windowClient.url === "/" && "focus" in windowClient) {
          return windowClient.focus();
        }
        return false;
      });

      // If no window client was focused, open a new one
      if (!hadWindowToFocus) {
        self.clients.openWindow("/");
      }
    })
  );
});
