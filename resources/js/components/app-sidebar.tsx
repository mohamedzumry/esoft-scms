import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Link, usePage } from '@inertiajs/react';
import { BookOpenText, Globe, LayoutGrid, LifeBuoy, MessageSquare, NotebookTabs, Ticket, Tickets, Users2 } from 'lucide-react';
import AppLogo from './app-logo';
import { NavFooter } from './nav-footer';

const footerNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/',
        icon: Globe,
    },
];

interface DashboardSidebarProps extends PageProps {
    auth: {
        user: {
            name: string;
            role: string;
            nick_name: string;
        };
    };
}

export function AppSidebar() {
    // Get user data from Inertia page props
    const { auth } = usePage<DashboardSidebarProps>().props;
    const user = auth?.user;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },

        // Only show 'Users' links for 'admin' and 'it_staff'
        ...(user?.role === 'admin' || user?.role === 'it_staff'
            ? [
                  {
                      title: 'Users',
                      href: '/dashboard/users',
                      icon: Users2,
                  },
              ]
            : []),

        {
            title: 'Events',
            href: '/dashboard/events',
            icon: Ticket,
        },

        // Only show 'Chats' links for 'admin', 'lecturer' and 'it_staff'
        ...(user?.role === 'admin' || user?.role === 'it_staff' || user?.role === 'lecturer'
            ? [
                  {
                      title: 'Chats',
                      href: '/dashboard/chats',
                      icon: MessageSquare,
                  },
              ]
            : []),

        // Only show 'Event Categories' links for 'admin' and 'it_staff'
        ...(user?.role === 'admin' || user?.role === 'it_staff'
            ? [
                  {
                      title: 'Event Categories',
                      href: '/dashboard/event-categories',
                      icon: Tickets,
                  },
              ]
            : []),

        // Only show Resources links for 'admin' and 'it_staff'
        ...(user?.role === 'admin' || user?.role === 'it_staff'
            ? [
                  {
                      title: 'Resources',
                      href: '/dashboard/resources',
                      icon: LifeBuoy,
                  },
              ]
            : []),

        // Only show Reservations links for all 'admin', 'it_staff', 'lecturer' and 'student'
        {
            title: 'Reservations',
            href: '/dashboard/reservations',
            icon: NotebookTabs,
        },
    ];

    const courseNavItems: NavItem[] = [
        ...(user?.role === 'admin' || user?.role === 'it_staff'
            ? [
                  {
                      title: 'Course Management',
                      icon: BookOpenText,
                      children: [
                          {
                              title: 'Courses',
                              href: '/dashboard/courses',
                          },
                          {
                              title: 'Batches',
                              href: '/dashboard/batches',
                          },
                          {
                              title: 'Modules',
                              href: '/dashboard/modules',
                          },
                      ],
                  },
              ]
            : []),
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain sectionName="Main" items={mainNavItems} />
            </SidebarContent>

            <SidebarContent>
                <NavMain sectionName="Courses" items={courseNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
