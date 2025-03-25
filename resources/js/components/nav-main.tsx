import { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface NavMainProps {
  sectionName: string;
  items: NavItem[];
  collapsed?: boolean;
}

export function NavMain({ sectionName, items, collapsed = false }: NavMainProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const page = usePage();

  const toggleDropdown = (title: string) => {
    if (collapsed) return;
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <SidebarGroup className="px-2 py-0">
      {!collapsed && <SidebarGroupLabel>{sectionName}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) =>
          item.children ? (
            // Items with children (dropdowns)
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                onClick={() => toggleDropdown(item.title)}
                tooltip={{ children: item.title }}
              >
                <div
                  className={`flex w-full items-center ${
                    collapsed ? 'justify-center' : ''
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {!collapsed && (
                    <>
                      <span className="ml-2">{item.title}</span>
                      <ChevronRight
                        className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                          openDropdown === item.title ? 'rotate-90' : ''
                        }`}
                      />
                    </>
                  )}
                </div>
              </SidebarMenuButton>
              {!collapsed && openDropdown === item.title && (
                <SidebarMenu>
                  {item.children.map((child) => (
                    <SidebarMenuItem key={child.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={child.href === page.url}
                        tooltip={{ children: child.title }}
                      >
                        <Link href={child.href!}>
                          {child.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </SidebarMenuItem>
          ) : (
            // Items without children (direct links)
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={item.href === page.url}
                tooltip={{ children: item.title }}
              >
                <Link
                  href={item.href!}
                  className={`flex w-full items-center ${
                    collapsed ? 'justify-center' : ''
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {!collapsed && <span className="ml-2">{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}