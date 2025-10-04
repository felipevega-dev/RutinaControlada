"use client";

import { Moon, Sun, LogOut, User as UserIcon } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { SyncIndicator } from "@/components/ui/SyncIndicator";
import { signOut } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

export function Header({ title }: { title: string }) {
  const { theme, toggleTheme, setTheme } = useThemeStore();
  const { user, clearUser } = useUserStore();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Aplicar el tema guardado al montar
    const savedTheme = localStorage.getItem("theme-storage");
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme);
      setTheme(parsed.state.theme);
    }
  }, [setTheme]);

  // Debug: Log user state
  useEffect(() => {
    console.log("Header - User state:", user);
    if (user?.photoURL) {
      console.log("Photo URL:", user.photoURL);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    clearUser();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 max-w-screen-xl mx-auto gap-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
          {title}
        </h1>
        <div className="flex items-center gap-2">
          <SyncIndicator />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Debug Info - Remover después */}
          {!user && (
            <div className="text-xs text-red-500 dark:text-red-400 hidden md:block">
              No user
            </div>
          )}

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-all border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 shadow-sm"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Usuario"}
                    className="w-9 h-9 rounded-full object-cover border-2 border-primary-500 dark:border-primary-400 ring-2 ring-primary-100 dark:ring-primary-900/30"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error("Error cargando imagen:", user.photoURL);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                {!user.photoURL && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center border-2 border-primary-400 dark:border-primary-300 ring-2 ring-primary-100 dark:ring-primary-900/30 shadow-md">
                    <span className="text-white font-bold text-base">
                      {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-900 dark:text-white hidden sm:inline max-w-[120px] truncate">
                  {user.displayName || user.email?.split('@')[0] || "Usuario"}
                </span>
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-20 overflow-hidden"
                    >
                      <div className="p-5 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-slate-800 dark:to-slate-900 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.displayName || "Usuario"}
                              className="w-14 h-14 rounded-full object-cover border-3 border-white dark:border-gray-700 shadow-lg ring-2 ring-primary-200 dark:ring-primary-800"
                              referrerPolicy="no-referrer"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                console.error("Error cargando imagen dropdown:", user.photoURL);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : null}
                          {!user.photoURL && (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg ring-2 ring-primary-200 dark:ring-primary-800">
                              <span className="text-white font-bold text-xl">
                                {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-gray-900 dark:text-white truncate">
                              {user.displayName || user.email?.split('@')[0] || "Usuario"}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all rounded-xl"
                        >
                          <LogOut className="w-5 h-5" />
                          Cerrar sesión
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

