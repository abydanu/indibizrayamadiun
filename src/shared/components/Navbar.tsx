import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="fixed z-50 w-full py-3 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center">
          <div className="n">
            <Image
              src="./logo_indibiz.svg"
              alt="indibiz"
              height={120}
              width={120}
            />
          </div>
          <Button asChild size={'lg'} className='hover:bg-red-700 duration-300 transition-all'>
            <a className="flex items-center gap-2" href='https://wa.me/628112680147' target='_blank'>
              <MessageSquare className="font-extrabold" />
              Konsultasi Sekarang
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
