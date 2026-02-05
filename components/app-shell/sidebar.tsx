'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { BarChart3, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navItems } from './nav-items';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-200 ease-out',
          collapsed ? 'w-16' : 'w-56',
        )}>
        <div className="flex flex-col h-full">
          <div
            className={cn(
              'flex items-center h-16 border-b border-sidebar-border px-4',
              collapsed ? 'justify-center' : 'justify-between',
            )}>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center group-hover:rounded-none transition-all duration-200">
                <BarChart3 className="w-5 h-5 text-background" />
              </div>
              {!collapsed && <span className="font-semibold">ProdLines</span>}
            </Link>
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover-button"
                onClick={() => setCollapsed(true)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/');
              const ItemIcon = item.icon;
              return collapsed ? (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 hover:rounded-none mx-auto',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      )}>
                      <ItemIcon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 h-10 rounded-xl transition-all duration-200 hover:rounded-none group',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}>
                  <ItemIcon className="h-5 w-5 icon-hover" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {collapsed && (
            <div className="p-3 border-t border-sidebar-border">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 mx-auto hover-button"
                    onClick={() => setCollapsed(false)}>
                    <ChevronLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Expand sidebar</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
