import { motion } from "framer-motion";
import { ChevronLeft, QrCode } from "lucide-react";
import React from "react";

interface HeaderProps {
  orderId: string;
  onQrCodeClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ orderId, onQrCodeClick }) => {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glass effect container */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-50/80 via-white/90 to-amber-50/80 backdrop-blur-md -z-10" />

      {/* Border highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-amber-100/0 via-amber-200/80 to-amber-100/0" />

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-4 px-5">
        <div className="flex justify-between items-center">
          {/* Logo here */}
          <motion.div
            className="flex items-center gap-x-3"
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <motion.button
              className="p-2 -ml-2 text-amber-700 hover:bg-amber-50 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            <div className="flex items-center">
              <motion.div
                className="relative w-7 h-7 mr-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-sm overflow-hidden flex items-center justify-center"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-white text-xs font-bold">VS</span>
                <motion.div
                  className="absolute inset-0 bg-white opacity-20"
                  animate={{
                    left: ["100%", "-100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 3,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                  style={{ width: "50%", transform: "skewX(-20deg)" }}
                />
              </motion.div>

              <h1 className="text-xl font-extrabold">
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  Veg Sagar
                </span>
              </h1>
            </div>
          </motion.div>

          {/* Order info section */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ x: 5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100/60 rounded-full border border-amber-100 shadow-sm">
              <motion.span
                className="block w-2 h-2 rounded-full bg-amber-500 mr-2"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="text-sm font-medium text-amber-900/80">
                #{orderId}
              </span>
            </div>

            <motion.button
              onClick={onQrCodeClick}
              className="relative p-2.5 rounded-full shadow-sm overflow-hidden"
              aria-label="Show QR code"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-100 rounded-full" />

              {/* Shimmering effect */}
              <motion.div
                className="absolute inset-0 bg-white opacity-30 rounded-full"
                animate={{
                  background: [
                    "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
                    "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 70%)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />

              <QrCode className="relative z-10 h-5 w-5 text-amber-700" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
