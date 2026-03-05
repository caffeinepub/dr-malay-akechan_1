import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useState } from "react";

interface AdminLoginProps {
  onLogin: () => void | Promise<void>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate brief delay for UX
    await new Promise((r) => setTimeout(r, 400));

    if (username === "malay" && password === "duke46") {
      onLogin();
    } else {
      setError("Invalid credentials. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(var(--violet) / 0.1) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--violet) / 0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "oklch(var(--cyan) / 0.3)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: "oklch(var(--violet) / 0.3)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-auto px-4"
      >
        {/* Card */}
        <div className="glass border border-border/50 rounded-2xl overflow-hidden shadow-card">
          {/* Top gradient bar */}
          <div className="h-1 bg-gradient-to-r from-cyan via-violet to-emerald" />

          <div className="p-8">
            {/* Icon & title */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet/20 to-cyan/20 border border-violet/30 flex items-center justify-center mx-auto mb-4 glow-violet"
              >
                <ShieldCheck size={28} className="text-violet" />
              </motion.div>
              <h1 className="font-display text-2xl font-bold text-gradient-violet">
                Admin Login
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your credentials to access the dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  data-ocid="admin.login.input"
                  className="h-10 bg-background/50 border-border/50 focus:border-violet/50 focus:ring-violet/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    data-ocid="admin.password.input"
                    className="h-10 bg-background/50 border-border/50 focus:border-violet/50 focus:ring-violet/20 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Alert
                      variant="destructive"
                      data-ocid="admin.login.error_state"
                      className="py-2.5"
                    >
                      <AlertCircle size={14} />
                      <AlertDescription className="text-xs">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                data-ocid="admin.login.submit_button"
                disabled={isLoading}
                className="w-full h-10 bg-gradient-to-r from-violet to-cyan text-white border-0 hover:opacity-90 transition-opacity font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Back to site */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Back to{" "}
          <a
            href="/"
            className="text-cyan hover:text-cyan/80 transition-colors"
          >
            public site
          </a>
        </p>
      </motion.div>
    </div>
  );
}
