"use client";

import CartDrawer from "@/components/OrderSummary/CartDrawer";
import Header from "@/components/OrderSummary/Header";
import StatusAnimation from "@/components/OrderSummary/StatusAnimation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  registerServiceWorker,
  requestNotificationPermission,
  subscribeUserToPush,
} from "@/lib/pushNotifications";
import { formatCurrency } from "@/lib/utils";
import { Order, OrderItem, OrderStatus } from "@/types/order";
import { DialogTitle } from "@radix-ui/react-dialog";
import axios from "axios";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const QRCodeSVG = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeSVG),
  {
    ssr: false,
  }
);

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Mock data for demo
const mockOrderItems: OrderItem[] = [
  {
    id: "1",
    name: "Pav bhaji",
    price: 180,
    quantity: 1,
    imgUrl: "/pav-bhaji.webp",
  },
  {
    id: "2",
    name: "Hakka Noodles",
    price: 150,
    quantity: 1,
    imgUrl: "/hakka-noodles.jpeg",
  },
  {
    id: "3",
    name: "Paneer Tikka",
    price: 250,
    quantity: 1,
    imgUrl: "/paneer-tikka.jpg",
  },
];

const mockOrder: Order = {
  id: "456",
  status: OrderStatus.NEW,
  items: mockOrderItems,
  subtotal: mockOrderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ),
  tax:
    mockOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) *
    0.08,
  total:
    mockOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) *
    1.08,
  createdAt: new Date(),
};

const OrderSummaryPage = () => {
  const [order, setOrder] = useState<Order>(mockOrder);
  const [showQrCode, setShowQrCode] = useState(false);
  const [prevStatus, setPrevStatus] = useState<OrderStatus>(order.status);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState(false);
  const [pollingActive, setPollingActive] = useState(true);

  // Fetch order status from backend
  const fetchOrderStatus = async () => {
    try {
      // Only make the API call if polling is active
      if (!pollingActive) {
        return;
      }

      // console.log("Polling for order status updates");
      const response = await axios.get(`${API_URL}/orders/${order.id}/status`);

      if (response.data && response.data.orderStatus) {
        const newStatus = response.data.orderStatus;

        // Only update if status has changed
        if (newStatus !== order.status) {
          // console.log(
          //   `Polling detected status change: ${order.status} → ${newStatus}`
          // );

          setOrder((prevOrder) => ({
            ...prevOrder,
            status: newStatus as OrderStatus,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch order status:", error);
    }
  };

  // Set up push notification handling
  useEffect(() => {
    async function setupPushNotifications() {
      // Only run on client side
      if (typeof window === "undefined") return;

      try {
        // Register service worker
        const swRegistered = await registerServiceWorker();
        if (!swRegistered) {
          console.log(
            "Service worker registration failed, falling back to polling"
          );
          return;
        }

        // Request for permission
        const permissionGranted = await requestNotificationPermission();
        if (!permissionGranted) {
          console.log(
            "Notification permission denied, falling back to polling"
          );
          return;
        }

        // Subscribe user to push notifications for this order
        const subscribed = await subscribeUserToPush(order.id);

        // If everything succeeded, disable polling
        if (subscribed) {
          setPushNotificationsEnabled(true);
          setPollingActive(false);
          console.log("Push notifications enabled, polling disabled");
        }
      } catch (error) {
        console.error("Failed to set up push notifications:", error);
      }
    }

    setupPushNotifications();
  }, [order.id]);

  // Listen for order status updates from push notifications
  useEffect(() => {
    const handleStatusUpdate = (event: CustomEvent) => {
      const { orderId, status } = event.detail;

      // Convert orderId to string for comparison
      if (String(orderId) === order.id && status) {
        console.log(`Updating status to: ${status}`);
        const statusMap = {
          NEW: OrderStatus.NEW,
          COOKING: OrderStatus.COOKING,
          READY: OrderStatus.READY,
          COMPLETED: OrderStatus.COMPLETED,
        };
        const validStatus = status as keyof typeof statusMap;
        const newStatus = statusMap[validStatus];

        setOrder((prevOrder) => {
          console.log(`Setting status: ${prevOrder.status} → ${newStatus}`);
          return { ...prevOrder, status: newStatus };
        });

        setPrevStatus(newStatus);
      } else {
        console.log(
          `ID comparison failed: ${orderId} (${typeof orderId}) !== ${
            order.id
          } (${typeof order.id})`
        );
      }
    };

    window.addEventListener(
      "orderStatusUpdate",
      handleStatusUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "orderStatusUpdate",
        handleStatusUpdate as EventListener
      );
    };
  }, [order.id]);

  useEffect(() => {
    if (pushNotificationsEnabled) {
      // If push notifications are enabled, we don't need polling
      setPollingActive(false);
      return;
    }

    // Initial fetch
    fetchOrderStatus();

    // Set up polling interval - adaptive based on document visibility
    let intervalId: NodeJS.Timeout;
    const pollingInterval = 30000; // 30 seconds when tab is visible
    const backgroundPollingInterval = 60000; // 60 seconds when tab is in background

    // Set initial interval based on visibility
    intervalId = setInterval(
      fetchOrderStatus,
      document.visibilityState === "visible"
        ? pollingInterval
        : backgroundPollingInterval
    );

    // Adapt polling frequency based on visibility state
    const handleVisibilityChange = () => {
      clearInterval(intervalId);
      intervalId = setInterval(
        fetchOrderStatus,
        document.visibilityState === "visible"
          ? pollingInterval
          : backgroundPollingInterval
      );
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [order.id, pushNotificationsEnabled]);

  // toast notification to show when status changes
  useEffect(() => {
    if (order.status !== prevStatus) {
      toast.custom(
        () => (
          <div className="bg-white/90 backdrop-blur-sm border border-amber-100 p-3 rounded-lg shadow-sm transition-all">
            <div className="flex items-start space-x-2">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-amber-500 flex-shrink-0"></div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  Order Updated
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Your order is now:{" "}
                  <span className="text-amber-600 font-medium">
                    {order.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ),
        {
          duration: 2000,
        }
      );
      setPrevStatus(order.status);
    }
  }, [order.status, prevStatus]);

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-amber-50 to-amber-100/50 overflow-hidden">
      {/* Decorative elements here */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-amber-200/20 blur-3xl"></div>
        <div className="absolute top-3/4 -right-20 w-60 h-60 rounded-full bg-amber-300/20 blur-3xl"></div>
      </div>

      <div className="min-h-screen flex flex-col justify-center items-center pb-24 px-4">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header
            orderId={order.id}
            onQrCodeClick={() => setShowQrCode(true)}
          />
        </div>

        <StatusAnimation
          currentStatus={order.status}
          key={`status-${order.status}`}
        />

        {/* Estimated time for food to get prerpared */}
        <motion.div
          className="text-center mt-8 px-7 py-5 bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-amber-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-gray-700 font-medium">Thank you for your order!</p>
          <p className="mt-2 text-amber-800 font-semibold flex flex-col sm:flex-row items-center justify-center gap-1">
            Estimated pickup time:
            <span className="text-amber-600 inline-block relative">
              <motion.span
                className="absolute inset-0 bg-amber-100/50 rounded-md -z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                className="px-2 py-0.5"
              >
                {new Date(Date.now() + 30 * 60000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </motion.span>
            </span>
          </p>
        </motion.div>
      </div>

      {/* Cart summary trigger button */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center z-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button
            onClick={() => setIsCartOpen(true)}
            className="px-7 py-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-[0_5px_25px_rgba(245,158,11,0.25)] flex items-center space-x-3 transition-all duration-300 hover:scale-105 transform"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="font-medium">
              View Order • {formatCurrency(order.total)}
            </span>
            <motion.span
              className="absolute inset-0 rounded-full bg-white"
              initial={{ opacity: 0.15 }}
              animate={{
                opacity: [0.15, 0.25, 0.15],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{ zIndex: -1 }}
            />
          </Button>
        </motion.div>
      </div>

      {/* Cart Drawer here */}
      <CartDrawer
        order={order}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* QR code dialog here */}
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogTitle className="hidden" />
        <DialogContent className="sm:max-w-md bg-gradient-to-b from-amber-50 to-amber-100/50 border-amber-200/50 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm rounded-3xl p-0 overflow-hidden">
          <motion.div
            className="flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium text-amber-800 mb-5">
              Order #{order.id}
            </h3>
            <div className="p-7 bg-white rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-amber-100">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <QRCodeSVG
                  value={`https://dynish.app/rest/order/${order.id}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                  bgColor="#FFFFFF"
                  fgColor="#F59E0B" // Amber-500
                />
              </motion.div>
            </div>
            <p className="mt-6 text-sm text-amber-700 text-center max-w-[250px]">
              Scan this code to check your order status on your device
            </p>
          </motion.div>
        </DialogContent>
      </Dialog>

      <div className="absolute bottom-3 right-3 z-10 mt-10">
        <a
          href="https://dynish.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-amber-100 text-xs text-amber-700 hover:bg-white transition-colors"
        >
          <span className="font-medium">Powered by</span>
          <span className="font-semibold ml-1 text-amber-600">Dynish</span>
        </a>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
