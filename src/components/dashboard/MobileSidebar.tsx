
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { MobileNavItem } from './NavItem';
import { dashboardNavItems } from '@/data/dashboardNavigation';

export const MobileSidebar: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <div className="flex items-center gap-2 p-2 mb-6">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
            OS
          </div>
          <span className="font-semibold">OrderSys</span>
        </div>
        
        <div className="space-y-1">
          {dashboardNavItems.map((item) => (
            <MobileNavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
