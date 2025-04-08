"use client";

import { OrderStatus } from "@/types/order";
import { motion } from "framer-motion";
import { Check, Clock, ShoppingBag, Utensils } from "lucide-react";
import React from "react";

interface TimelineProps {
  currentStatus: OrderStatus;
}

const Timeline: React.FC<TimelineProps> = ({ currentStatus }) => {
  const statuses = [
    OrderStatus.NEW,
    OrderStatus.COOKING,
    OrderStatus.READY,
    OrderStatus.COMPLETED,
  ];

  const getStatusIndex = (status: OrderStatus) => {
    return statuses.indexOf(status);
  };

  const currentStatusIndex = getStatusIndex(currentStatus);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return <ShoppingBag className="h-5 w-5" />;
      case OrderStatus.COOKING:
        return <Utensils className="h-5 w-5" />;
      case OrderStatus.READY:
        return <Clock className="h-5 w-5" />;
      case OrderStatus.COMPLETED:
        return <Check className="h-5 w-5" />;
    }
  };

  return (
    <div className="my-8 px-2">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute inset-0 flex items-center">
          <div className="h-0.5 w-full bg-gray-200 rounded-full"></div>
        </div>

        {/* Status indicators */}
        <div className="relative flex justify-between">
          {statuses.map((status, index) => {
            const isActive = index <= currentStatusIndex;
            const isCurrentStatus = index === currentStatusIndex;

            return (
              <div key={status} className="flex flex-col items-center">
                <motion.div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                      : "bg-gray-200"
                  } shadow-md z-10`}
                  initial={{ scale: 1 }}
                  animate={{
                    scale: isCurrentStatus ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: isCurrentStatus ? Infinity : 0,
                    repeatType: "reverse",
                    repeatDelay: 1,
                  }}
                >
                  <span className="text-white">{getStatusIcon(status)}</span>
                </motion.div>
                <div className="mt-3 text-xs font-medium text-center">
                  <span
                    className={`${
                      isActive ? "text-gray-800" : "text-gray-400"
                    } ${isCurrentStatus ? "font-bold" : ""}`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
