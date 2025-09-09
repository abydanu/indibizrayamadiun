import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/shared/ui/button';

const Navbar = () => {
  return (
    <nav className="fixed z-50 w-full py-3 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center">
          <div className="n">
            <img src="./logo_indibiz.svg" alt="" className="md:w-[120px] w-[120px]" />
          </div>
          <Button className='flex items-center gap-2' size={"lg"}><MessageSquare className='font-semibold'/>Konsultasi Sekarang</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
