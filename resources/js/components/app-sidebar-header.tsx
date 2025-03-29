import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Notification, type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { LogOut } from 'lucide-react';
import Notifications from './notifications';
import { router, usePage } from '@inertiajs/react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[]; }) {
    const { notifications } = usePage().props as any;
    const logout = () => {
        router.post('/logout');
    }
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center space-x-4">
                <Notifications notifications={notifications} />
                <Button variant={'destructive'} size={'sm'} onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </Button>
            </div>
        </header>
    );
}
