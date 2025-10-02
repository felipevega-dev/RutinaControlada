"use client";

import { ReactNode } from "react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const { isLoading, error, isAuthenticated } = useFirebaseAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Inicializando Firebase...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
            Error al conectar con Firebase
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Verifica tu configuración en .env.local
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

