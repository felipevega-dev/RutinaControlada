"use client";

import { useEffect, useState } from "react";
import { initAuth } from "@/lib/firebase";

export function useFirebaseAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        await initAuth();
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (err) {
        console.error("Error authenticating:", err);
        setError("Error al inicializar Firebase");
        setIsLoading(false);
      }
    };

    authenticate();
  }, []);

  return { isAuthenticated, isLoading, error };
}

