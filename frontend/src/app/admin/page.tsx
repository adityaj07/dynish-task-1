"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Order, OrderItem, OrderStatus } from "@/types/order";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Mock order using the same mock data from the user page
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

export default function AdminPage() {
  const [order, setOrder] = useState<Order>(mockOrder);
  const [loading, setLoading] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      console.log("Fetching order details from backend");
      const response = await axios.get(
        `${API_URL}/orders/${mockOrder.id}/status`
      );

      if (response.data && response.data.orderStatus) {
        // Update the order with the correct status from backend
        setOrder((prevOrder) => ({
          ...prevOrder,
          status: response.data.orderStatus as OrderStatus,
        }));
        console.log(`Loaded order with status: ${response.data.orderStatus}`);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  // Function to update order status
  const updateOrderStatus = async (newStatus: OrderStatus) => {
    try {
      setLoading(true);

      // Map the numeric enum to string values that backend expects
      const statusMap = {
        [OrderStatus.NEW]: "NEW",
        [OrderStatus.COOKING]: "COOKING",
        [OrderStatus.READY]: "READY",
        [OrderStatus.COMPLETED]: "COMPLETED",
      };

      // Convert to string before sending
      const statusString = statusMap[newStatus];

      // Call API to update order status
      await axios.patch(`${API_URL}/orders/${order.id}/status`, {
        status: statusString,
      });

      // Update local state
      setOrder((prevOrder) => ({
        ...prevOrder,
        status: newStatus,
      }));

      toast.success(`Order status updated to ${statusString}`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  // Status button configurations
  const statusButtons = [
    {
      status: OrderStatus.NEW,
      label: "Received",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      status: OrderStatus.COOKING,
      label: "Cooking",
      color: "bg-amber-500 hover:bg-amber-600",
    },
    {
      status: OrderStatus.READY,
      label: "Ready",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      status: OrderStatus.COMPLETED,
      label: "Complete",
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-500">
            Update order statuses and track customer orders
          </p>
        </header>

        <Card className="shadow-lg border-gray-200 ">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50 flex justify-start items-center h-16">
            <CardTitle className="text-xl font-bold">
              Order #{order.id}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-8">
              <h3 className="text-gray-600 font-medium mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Tax:</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                  <span className="text-lg font-medium">Total:</span>
                  <span className="text-lg font-bold text-amber-600">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-gray-600 font-medium mb-4">
                Update Order Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statusButtons.map((btn) => (
                  <Button
                    key={btn.status}
                    onClick={() => updateOrderStatus(btn.status)}
                    disabled={loading || order.status === btn.status}
                    className={`${btn.color} text-white py-6 ${
                      order.status === btn.status
                        ? "ring-2 ring-offset-2 ring-offset-white ring-blue-300"
                        : ""
                    }`}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
              {loading && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Updating order status...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
