import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminActor } from "@/hooks/useAdminActor";
import {
  AlignLeft,
  Building2,
  FileText,
  LayoutDashboard,
  Loader2,
  LogOut,
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
  const { isReady } = useAdminActor();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />

      <div className="relative container mx-auto px-3 sm:px-4 py-5 sm:py-8">
        {/* Dashboard header — stacks vertically on mobile */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3"
          data-ocid="admin.dashboard.panel"
        >
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-gradient-cyan">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage all website content from here
              </p>
            </div>
            {!isReady && (
              <Loader2
                size={16}
                className="text-cyan animate-spin flex-shrink-0 mt-1"
                data-ocid="admin.actor.loading_state"
              />
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            data-ocid="admin.logout.button"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-2 w-full sm:w-auto"
          >
            <LogOut size={14} />
            Logout
          </Button>
        </motion.div>

        {/* Tabs — horizontal scroll on mobile */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex overflow-x-auto gap-1 p-1 bg-muted/50 border border-border/50 rounded-xl mb-8 h-auto scrollbar-none">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                data-ocid="admin.tab"
                className="flex-shrink-0 flex items-center gap-2 text-xs sm:text-sm px-3 py-2 rounded-lg whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan/20 data-[state=active]:to-violet/20 data-[state=active]:border data-[state=active]:border-cyan/30 data-[state=active]:text-foreground transition-all"
              >
                <tab.icon size={14} className="flex-shrink-0" />
                <span>{tab.label}</span>
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
