"use client";
import type React from "react";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

interface ToastContextType {
  showToast: (message: string, type: "success" | "error") => void;
}

let toastContext: ToastContextType | null = null;

export function SimpleToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now().toString();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Make showToast available globally
  useEffect(() => {
    toastContext = { showToast };
  }, []);

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center justify-between p-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px]
              animate-in slide-in-from-right-full duration-300
              ${
                toast.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }
            `}
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// Global toast function
export const showToast = (
  message: string,
  type: "success" | "error" = "success"
) => {
  if (toastContext) {
    toastContext.showToast(message, type);
  }
};
