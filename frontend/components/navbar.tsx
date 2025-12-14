'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Users, Car } from 'lucide-react';

interface NavbarProps {
  currentPage?: 'dashboard' | 'vehicles' | 'staff';
}

export function Navbar({ currentPage }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-10 w-10 sm:h-14 sm:w-14 flex items-center justify-center">
              <img
                src="/logo.svg"
                alt="LA JOIE DE HICHA"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-xl font-bold text-green-700">LA JOIE DE HICHA</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Garage Management System</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => router.push('/admin/dashboard')}
              className="gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={currentPage === 'vehicles' ? 'default' : 'ghost'}
              onClick={() => router.push('/admin/vehicles')}
              className="gap-2"
            >
              <Car className="h-4 w-4" />
              Vehicles
            </Button>
            <Button
              variant={currentPage === 'staff' ? 'default' : 'ghost'}
              onClick={() => router.push('/admin/staff')}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Staff
            </Button>
            
            <div className="h-8 w-px bg-gray-300 mx-2" />
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => {
                router.push('/admin/dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={currentPage === 'vehicles' ? 'default' : 'ghost'}
              onClick={() => {
                router.push('/admin/vehicles');
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start gap-2"
            >
              <Car className="h-4 w-4" />
              Vehicles
            </Button>
            <Button
              variant={currentPage === 'staff' ? 'default' : 'ghost'}
              onClick={() => {
                router.push('/admin/staff');
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start gap-2"
            >
              <Users className="h-4 w-4" />
              Staff
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
