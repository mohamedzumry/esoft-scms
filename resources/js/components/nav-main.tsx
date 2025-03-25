import { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface NavMainProps {
  sectionName: string;
  items: NavItem[];
}

export function NavMain({ sectionName, items }: NavMainProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <div className="space-y-1">
      {items.map((item) =>
        item.children ? (
          // Items with children (dropdowns)
          <div key={item.title}>
            <button
              type="button"
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => toggleDropdown(item.title)}
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              <span>{item.title}</span>
              <ChevronRight
                className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                  openDropdown === item.title ? 'rotate-90' : ''
                }`}
              />
            </button>
            {openDropdown === item.title && (
              <div className="ml-4 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.title}
                    href={child.href!}
                    className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary"
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Items without children (direct links)
          <Link
            key={item.title}
            href={item.href!}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
            <span>{item.title}</span>
          </Link>
        )
      )}
    </div>
  );
}