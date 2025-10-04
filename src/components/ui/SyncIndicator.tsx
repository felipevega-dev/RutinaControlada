"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudOff, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useAppStore } from "@/store/appStore";

export function SyncIndicator() {
  const { syncStatus, isOnline, setIsOnline, setSyncStatus } = useAppStore();

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus("syncing");
      setTimeout(() => setSyncStatus("synced"), 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial status
    setIsOnline(navigator.onLine);
    if (navigator.onLine) {
      setSyncStatus("synced");
    } else {
      setSyncStatus("offline");
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setIsOnline, setSyncStatus]);

  const getStatusConfig = () => {
    switch (syncStatus) {
      case "syncing":
        return {
          icon: Loader2,
          text: "Sincronizando...",
          color: "text-primary-600 dark:text-primary-400",
          bgColor: "bg-primary-50 dark:bg-primary-900/20",
          animate: true,
        };
      case "synced":
        return {
          icon: CheckCircle,
          text: "Todo guardado",
          color: "text-success-600 dark:text-success-400",
          bgColor: "bg-success-50 dark:bg-success-900/20",
          animate: false,
        };
      case "offline":
        return {
          icon: CloudOff,
          text: "Sin conexión",
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-800",
          animate: false,
        };
      case "error":
        return {
          icon: AlertCircle,
          text: "Error",
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          animate: false,
        };
      default:
        return {
          icon: Cloud,
          text: "Listo",
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-800",
          animate: false,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  // Don't show indicator if everything is ok and synced
  if (syncStatus === "synced" && isOnline) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor}`}
      >
        <Icon
          className={`w-4 h-4 ${config.color} ${config.animate ? "animate-spin" : ""}`}
        />
        <span className={`text-xs font-medium ${config.color} hidden sm:inline`}>
          {config.text}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

