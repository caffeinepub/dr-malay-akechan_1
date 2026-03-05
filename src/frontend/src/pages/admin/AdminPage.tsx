import {
  clearAdminIdentity,
  getOrCreateAdminIdentity,
} from "@/utils/adminIdentity";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("adminLoggedIn") === "true";
  });
  const queryClient = useQueryClient();

  // Listen for storage events (logout from other tabs)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "adminLoggedIn") {
        setIsLoggedIn(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // On mount, restore the admin identity if the session is still active
  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") === "true") {
      getOrCreateAdminIdentity();
    }
  }, []);

  const handleLogin = async () => {
    localStorage.setItem("adminLoggedIn", "true");
    // Ensure the Ed25519 identity is created before the actor query runs
    getOrCreateAdminIdentity();
    setIsLoggedIn(true);
    // Invalidate admin actor so it reinitializes with the admin identity
    await queryClient.invalidateQueries({ queryKey: ["adminActor"] });
    await queryClient.refetchQueries({ queryKey: ["adminActor"] });
  };

  const handleLogout = async () => {
    localStorage.removeItem("adminLoggedIn");
    clearAdminIdentity();
    setIsLoggedIn(false);
    // Remove cached admin actor
    await queryClient.invalidateQueries({ queryKey: ["adminActor"] });
  };

  return (
    <AnimatePresence mode="wait">
      {isLoggedIn ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AdminDashboard onLogout={handleLogout} />
        </motion.div>
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AdminLogin onLogin={handleLogin} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
