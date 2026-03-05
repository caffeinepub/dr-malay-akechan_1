import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminActor } from "@/hooks/useAdminActor";
import {
  AlertCircle,
  AlignLeft,
  Building2,
  FileText,
  LayoutDashboard,
  Loader2,
  LogOut,
  RefreshCw,
  Share2,
  Stethoscope,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import AdminAboutTab from "./tabs/AdminAboutTab";
import AdminClinicsTab from "./tabs/AdminClinicsTab";
import AdminFooterTab from "./tabs/AdminFooterTab";
import AdminHeaderTab from "./tabs/AdminHeaderTab";
import AdminServicesTab from "./tabs/AdminServicesTab";
import AdminSocialTab from "./tabs/AdminSocialTab";

interface AdminDashboardProps {
  onLogout: () => void | Promise<void>;
}

const tabItems = [
  { value: "header", label: "Header", icon: FileText },
  { value: "about", label: "About", icon: LayoutDashboard },
  { value: "clinics", label: "Clinics", icon: Building2 },
  { value: "services", label: "Services", icon: Stethoscope },
  { value: "social", label: "Social", icon: Share2 },
  { value: "footer", label: "Footer", icon: AlignLeft },
];

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("header");
  const { actor, isFetching, isError, error } = useAdminActor();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />

      <div className="relative container mx-auto px-4 py-8">
        {/* Dashboard header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
          data-ocid="admin.dashboard.panel"
        >
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-gradient-cyan">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all website content from here
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            data-ocid="admin.logout.button"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-2"
          >
            <LogOut size={14} />
            Logout
          </Button>
        </motion.div>

        {/* Actor initialization loading state */}
        {isFetching && !actor && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/40 mb-6"
            data-ocid="admin.actor.loading_state"
          >
            <Loader2
              size={16}
              className="text-cyan animate-spin flex-shrink-0"
            />
            <div>
              <p className="text-sm font-medium">
                Authenticating admin session…
              </p>
              <p className="text-xs text-muted-foreground">
                Connecting to the backend with your admin identity
              </p>
            </div>
          </motion.div>
        )}

        {/* Actor initialization error state */}
        {isError && !isFetching && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
            data-ocid="admin.actor.error_state"
          >
            <Alert className="border-destructive/40 bg-destructive/5">
              <AlertCircle size={16} className="text-destructive" />
              <AlertTitle className="text-destructive font-semibold">
                Admin authentication failed
              </AlertTitle>
              <AlertDescription className="text-sm text-muted-foreground mt-1">
                {error instanceof Error
                  ? error.message
                  : "Could not connect to the backend as admin. Please reload the page."}
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw size={13} />
                    Reload page
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Skeleton while loading */}
        {isFetching && !actor && (
          <div className="space-y-3 mb-6">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-muted/50 border border-border/50 rounded-xl mb-8">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                data-ocid="admin.tab"
                className="flex items-center gap-2 text-xs sm:text-sm px-3 py-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan/20 data-[state=active]:to-violet/20 data-[state=active]:border data-[state=active]:border-cyan/30 data-[state=active]:text-foreground transition-all"
              >
                <tab.icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="header">
            <AdminHeaderTab />
          </TabsContent>
          <TabsContent value="about">
            <AdminAboutTab />
          </TabsContent>
          <TabsContent value="clinics">
            <AdminClinicsTab />
          </TabsContent>
          <TabsContent value="services">
            <AdminServicesTab />
          </TabsContent>
          <TabsContent value="social">
            <AdminSocialTab />
          </TabsContent>
          <TabsContent value="footer">
            <AdminFooterTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
