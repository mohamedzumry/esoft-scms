import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import { Notification, type BreadcrumbItem } from "@/types";
import { useEffect } from "react";
import { type ReactNode } from "react";
import { Toaster, toast } from "react-hot-toast";

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  flash?: { success?: string; error?: string };
  notifications?: Notification[];

}

export default function AppLayout({ children, breadcrumbs, flash, notifications, ...props }: AppLayoutProps) {
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
      {/* Toaster container for displaying toast notifications */}
      <Toaster position="top-right" />
    </AppLayoutTemplate>
  );
}