import {
  clearAdminIdentity,
  getOrCreateAdminIdentity,
} from "@/utils/adminIdentity";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem("adminLoggedIn") === "true",
  );
  const queryClient = useQueryClient();

  const handleLogin = () => {
    localStorage.setItem("adminLoggedIn", "true");
    // Pre-create the Ed25519 identity so the actor query can use it immediately
    getOrCreateAdminIdentity();
    setIsLoggedIn(true);
    queryClient.invalidateQueries({ queryKey: ["adminActor"] });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    clearAdminIdentity();
    setIsLoggedIn(false);
    queryClient.removeQueries({ queryKey: ["adminActor"] });
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
