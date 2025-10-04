"use client";

import { useUserStore } from "@/store/userStore";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";

export default function DebugPage() {
  const { user } = useUserStore();
  const { isAuthenticated, isLoading } = useFirebaseAuth();

  return (
    <MainLayout title="Debug">
      <div className="p-4 space-y-4">
        <Card>
          <h2 className="font-bold mb-4 text-gray-900 dark:text-white">Estado de Autenticación</h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">isLoading:</span>
              <span className="font-mono text-gray-900 dark:text-white">{isLoading ? "true" : "false"}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">isAuthenticated:</span>
              <span className="font-mono text-gray-900 dark:text-white">{isAuthenticated ? "true" : "false"}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">user exists:</span>
              <span className="font-mono text-gray-900 dark:text-white">{user ? "true" : "false"}</span>
            </div>
          </div>
        </Card>

        {user && (
          <Card>
            <h2 className="font-bold mb-4 text-gray-900 dark:text-white">Datos del Usuario</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">UID:</span>
                <p className="font-mono text-xs break-all text-gray-900 dark:text-white">{user.uid}</p>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <p className="font-mono text-gray-900 dark:text-white">{user.email}</p>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">Display Name:</span>
                <p className="font-mono text-gray-900 dark:text-white">{user.displayName || "N/A"}</p>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">Photo URL:</span>
                <p className="font-mono text-xs break-all text-gray-900 dark:text-white">{user.photoURL || "N/A"}</p>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <h2 className="font-bold mb-4 text-gray-900 dark:text-white">LocalStorage</h2>
          <div className="text-xs">
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto text-gray-900 dark:text-white">
              {typeof window !== "undefined" && JSON.stringify({
                userStorage: localStorage.getItem("user-storage"),
                themeStorage: localStorage.getItem("theme-storage"),
              }, null, 2)}
            </pre>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

