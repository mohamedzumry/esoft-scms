import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { Notification, type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { usePage } from "@inertiajs/react";

export default function AppSidebarLayout({ children, breadcrumbs = [], notifications }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] , notifications?: Notification[]}>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
