'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { AuthService } from '../services/auth-service';

type FormData = {
  username: string;
  password: string;
};

const LoginCard = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const user = await AuthService.login(data);
    console.log(user);
    

    if (user) {
    }
  };

  return (
    <Card className="w-[calc(100%-2rem)] max-w-sm mx-auto rounded-lg shadow-md">
      <CardHeader className="space-y-2 pb-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Halaman Login Admin</h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-1">
            Masuk menggunakan akun username dan password Administrator
          </p>
        </div>
        <div className="border-t border-border pt-4">
          <CardTitle className="font-bold text-2xl text-center">Masuk</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <div className="grid gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                required
                {...register('username')}
              />
            </div>
            <div className="grid gap-1.5 mt-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? 'text' : 'password'}
                  required
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground cursor-pointer"
                >
                  {show ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>
          </div>
          <CardFooter className="flex-col gap-3 pt-4 mt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Loading...' : 'Masuk'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginCard;