'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const LoginCard = () => {
  const [show, setShow] = useState(false);

  return (
      <Card className="w-full max-w-sm rounded-lg">
        <CardHeader>
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold">Halaman Admin/Agen</h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              masuk menggunakan akun admin/agen anda
            </p>
            <div className="border-t border-gray-300 mt-4"></div>
          </div>
          <CardTitle className="font-bold text-2xl">Masuk</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? 'text' : 'password'}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                  >
                    {show ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Masuk
          </Button>
        </CardFooter>
      </Card>
  );
}

export default LoginCard;