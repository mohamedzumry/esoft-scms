import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import { type BreadcrumbItem } from "@/types";
import { type ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  flash?: { success?: string; error?: string }; // Optional flash messages
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
      <Toaster position="top-right" />
    </AppLayoutTemplate>
  );
}