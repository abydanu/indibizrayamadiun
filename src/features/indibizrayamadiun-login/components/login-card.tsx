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
      router.push('/admin/dasbor');
    }
  };

  return (
    <Card className="w-full max-w-sm rounded-lg">
      <CardHeader>
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold">Halaman Login Admin</h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            masuk menggunakan akun username dan password Administrator
          </p>
          <div className="border-t border-border mt-4"></div>
        </div>
        <CardTitle className="font-bold text-2xl">Masuk</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                required
                {...register('username')}
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
          <CardFooter className="flex-col gap-2 mt-6">
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