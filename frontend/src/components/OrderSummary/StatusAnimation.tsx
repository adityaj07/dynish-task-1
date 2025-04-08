"use client";

import {
  getAnimationData,
  getShortStatus,
  getStatusDescription,
  getStatusIndex,
  getStatusTitle,
} from "@/helpers/orderSummaryHelpers";
import { OrderStatus } from "@/types/order";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChefHat, Clock, ShoppingBag } from "lucide-react";
import React from "react";
import ClientLottie from "./ClientLottie";

interface StatusAnimationProps {
  currentStatus: OrderStatus;
}

const StatusAnimation: React.FC<StatusAnimationProps> = ({ currentStatus }) => {
  // We render the lottie animation based on current status of the order
  const renderAnimation = (status: OrderStatus) => {
    return (
      <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center bg-transparent">
        <motion.div
          className="relative w-full h-full bg-transparent"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <ClientLottie
            animationData={getAnimationData(status)}
            className="w-full h-full"
          />
        </motion.div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto pt-28 mt-2 relative z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStatus}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full flex flex-col items-center"
        >
          <div className="relative mb-1 z-10">
            <motion.div
              className="absolute -inset-x-8 -inset-y-3 bg-amber-50/70 rounded-2xl -z-10 blur-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            />
            <motion.h2
              className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {getStatusTitle(currentStatus)}
            </motion.h2>
          </div>

          <div className="relative mb-8 z-10">
            <motion.p
              className="text-sm text-gray-600 text-center max-w-xs px-6 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {getStatusDescription(currentStatus)}
            </motion.p>
            <motion.div
              className="h-[2px] w-16 mx-auto mt-4 bg-gradient-to-r from-amber-200/0 via-amber-300/80 to-amber-200/0"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 64, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          </div>

          <motion.div
            className="relative mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {renderAnimation(currentStatus)}
          </motion.div>

          {/* Progress Timeline */}
          <div className="w-full max-w-xs sm:max-w-sm px-4 mt-2">
            <div className="relative">
              {/* Progress line*/}
              <div className="absolute h-1 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 w-full top-4 rounded-full overflow-hidden shadow-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                  initial={{ width: "0%" }}
                  animate={{
                    width:
                      currentStatus === OrderStatus.NEW
                        ? "25%"
                        : currentStatus === OrderStatus.COOKING
                        ? "50%"
                        : currentStatus === OrderStatus.READY
                        ? "75%"
                        : "100%",
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>

              {/* Status markers */}
              <div className="flex justify-between relative z-10">
                {[
                  OrderStatus.NEW,
                  OrderStatus.COOKING,
                  OrderStatus.READY,
                  OrderStatus.COMPLETED,
                ].map((status, index) => {
                  const isActive = getStatusIndex(currentStatus) >= index;
                  const isCurrent = status === currentStatus;

                  return (
                    <div key={status} className="flex flex-col items-center">
                      <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center
                          ${
                            isCurrent
                              ? "bg-gradient-to-br from-amber-500 to-amber-600"
                              : isActive
                              ? "bg-amber-500"
                              : "bg-white border border-gray-200"
                          }`}
                        style={{
                          boxShadow: isCurrent
                            ? "0 3px 10px rgba(245, 158, 11, 0.4)"
                            : isActive
                            ? "0 2px 5px rgba(0, 0, 0, 0.05)"
                            : "0 1px 3px rgba(0, 0, 0, 0.05)",
                        }}
                        animate={
                          isCurrent
                            ? {
                                scale: [1, 1.12, 1],
                              }
                            : {}
                        }
                        transition={{
                          duration: 1.5,
                          repeat: isCurrent ? Infinity : 0,
                          repeatType: "reverse",
                        }}
                      >
                        {status === OrderStatus.NEW && (
                          <ShoppingBag
                            className={`h-4 w-4 ${
                              isActive ? "text-white" : "text-gray-400"
                            }`}
                          />
                        )}
                        {status === OrderStatus.COOKING && (
                          <ChefHat
                            className={`h-4 w-4 ${
                              isActive ? "text-white" : "text-gray-400"
                            }`}
                          />
                        )}
                        {status === OrderStatus.READY && (
                          <Clock
                            className={`h-4 w-4 ${
                              isActive ? "text-white" : "text-gray-400"
                            }`}
                          />
                        )}
                        {status === OrderStatus.COMPLETED && (
                          <Check
                            className={`h-4 w-4 ${
                              isActive ? "text-white" : "text-gray-400"
                            }`}
                          />
                        )}
                      </motion.div>
                      <span
                        className={`text-xs mt-2 font-medium
                        ${
                          isCurrent
                            ? "text-amber-800"
                            : isActive
                            ? "text-gray-700"
                            : "text-gray-400"
                        }`}
                      >
                        {getShortStatus(status)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StatusAnimation;
