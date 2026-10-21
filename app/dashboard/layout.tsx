import { AppSidebar } from "@/components/custom/dashboard/AppSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppSidebar>{children}</AppSidebar>;
}
