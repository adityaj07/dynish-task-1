"use client"

import React from "react";
import Image from "next/image";
import { OrderItem } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  subtotal,
  tax,
  total,
}) => {
  return (
    <Card className="shadow-md bg-white border-none overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-3">
        <CardTitle className="text-lg font-medium text-gray-800">
          Your Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-4 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex items-center py-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                {item.imgUrl ? (
                  <Image
                    src={item.imgUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-50">
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-sm font-medium text-gray-800">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </motion.div>
          ))}

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-800">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="text-gray-800">{formatCurrency(tax)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium pt-1">
              <span className="text-gray-800">Total</span>
              <span className="text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
