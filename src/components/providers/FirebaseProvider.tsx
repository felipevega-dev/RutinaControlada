"use client";

import { ReactNode, useEffect, useState } from "react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useAppStore } from "@/store/appStore";
import { useUserStore } from "@/store/userStore";
import { OnboardingModal } from "@/components/ui/OnboardingModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { Cloud, Loader2 } from "lucide-react";

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const { isLoading, error, isAuthenticated } = useFirebaseAuth();
  const { hasSeenOnboarding, setHasSeenOnboarding } = useAppStore();
  const { user } = useUserStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !hasSeenOnboarding) {
      // Show onboarding after a short delay for new users
      setTimeout(() => setShowOnboarding(true), 500);
    }
  }, [isAuthenticated, user, hasSeenOnboarding]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="relative mb-6">
            <Cloud className="w-16 h-16 text-primary-500 mx-auto" />
            <Loader2 className="w-6 h-6 text-primary-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Conectando con la nube
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preparando tus datos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark p-4">
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cloud className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error de conexión
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            No se pudo conectar con Firebase. Verifica tu configuración en .env.local
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <>
      {children}
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
    </>
  );
}

