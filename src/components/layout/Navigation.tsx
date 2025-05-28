
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Users, Calendar, Receipt, BarChart3, Home, Menu, FileText } from 'lucide-react';

const navigationItems = [
  {
    title: 'Accueil',
    href: '/',
    icon: Home,
    description: 'Page d\'accueil'
  },
  {
    title: 'Patients',
    href: '/patients',
    icon: Users,
    description: 'Gestion des patients'
  },
  {
    title: 'Rendez-vous',
    href: '/appointments',
    icon: Calendar,
    description: 'Planning des consultations'
  },
  {
    title: 'Facturation',
    href: '/billing',
    icon: Receipt,
    description: 'Factures et paiements'
  },
  {
    title: 'Documents',
    href: '/documents',
    icon: FileText,
    description: 'Documents et laboratoire'
  },
  {
    title: 'Rapports',
    href: '/reports',
    icon: BarChart3,
    description: 'Statistiques et analyses'
  }
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const NavigationList = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onItemClick}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 touch-target
              ${active 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }
            `}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-sm">{item.title}</div>
              <div className={`text-xs ${active ? 'text-blue-100' : 'text-gray-500'}`}>
                {item.description}
              </div>
            </div>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Navigation Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-blue-100">
        <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">MedicalApp</h1>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <NavigationList />
        </div>
      </div>

      {/* Header Mobile avec Menu Hamburger */}
      <div className="lg:hidden bg-white border-b border-blue-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="font-bold text-blue-600">MedicalApp</span>
        </Link>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="touch-target"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-white">
            <SheetHeader className="text-left pb-4">
              <SheetTitle className="text-blue-600 text-lg font-bold">
                Navigation
              </SheetTitle>
            </SheetHeader>
            <NavigationList onItemClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
