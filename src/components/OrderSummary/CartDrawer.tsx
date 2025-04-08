import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types/order";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface CartDrawerProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ order, isOpen, onClose }) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-white rounded-t-3xl max-h-[80vh] overflow-hidden">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="px-5 pt-4 pb-3 border-b border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-lg font-semibold text-gray-800">
                  Your Order
                </DrawerTitle>
                <DrawerDescription className="text-amber-600 font-bold">
                  {formatCurrency(order.total)}
                </DrawerDescription>
              </div>
              <DrawerClose className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                <X size={16} />
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Cart items here */}
          <div className="p-5 space-y-3 overflow-y-auto max-h-[40vh]">
            {order.items.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex items-center p-3 bg-amber-50/50 rounded-xl border border-amber-100/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white shadow-sm">
                  {item.imgUrl ? (
                    <Image
                      src={item.imgUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-amber-50">
                      <span className="text-xs text-amber-300">No image</span>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center justify-center bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-amber-600">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order summary here */}
          <motion.div
            className="p-5 bg-gradient-to-b from-white to-amber-50/30 border-t border-amber-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-800">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-800">
                  {formatCurrency(order.tax)}
                </span>
              </div>
              <div className="h-px bg-amber-100 my-2" />
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-800 font-medium">Total</span>
                <motion.span
                  className="text-lg font-semibold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                    delay: 0.4,
                  }}
                >
                  {formatCurrency(order.total)}
                </motion.span>
              </div>
            </div>

            {/* Continue button - can be later converted to pay now or if already paid  */}
            <DrawerFooter className="p-0 mt-6">
              <Button className="w-full py-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm hover:shadow-md transition-shadow duration-200">
                Continue
              </Button>
            </DrawerFooter>
          </motion.div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
