import React from 'react';
import { ThemeSwitch } from '@/shared/components/theme-switch';
import { ThemeLogo } from './theme-logo';

const Navbar = () => {
  return (
    <nav className="fixed z-50 w-full py-3 bg-background border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ThemeLogo
              width={120}
              height={120}
              alt="indibiz"
            />
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
