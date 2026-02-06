'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { BarChart3, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navItems } from './nav-items';

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden hover-button">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-sidebar p-0">
        <div className="flex items-center h-16 border-b border-sidebar-border px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-background" />
            </div>
            <SheetTitle>ProdLines</SheetTitle>
          </Link>
        </div>
        <nav className="py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 h-10 rounded-xl transition-all duration-200 hover:rounded-none',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}>
                <ItemIcon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
