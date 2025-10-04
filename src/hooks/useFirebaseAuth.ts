"use client";

import { useEffect, useState } from "react";
import { onAuthChange } from "@/lib/firebase";
import { useUserStore } from "@/store/userStore";
import type { User } from "@/types";

export function useFirebaseAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUserStore();

  useEffect(() => {
    try {
      const unsubscribe = onAuthChange((user: User | null) => {
        setUser(user);
        setIsAuthenticated(!!user);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error initializing auth:", err);
      setError("Error al inicializar autenticación");
      setIsLoading(false);
    }
  }, [setUser]);

  return { isAuthenticated, isLoading, error };
}

