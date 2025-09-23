import { toast } from 'sonner';
import Cookies from 'js-cookie';
import type { User } from '../../smartsync-dashboard/types/user';

export class AuthService {
  static async login(credentials: {
    username: string;
    password: string;
  }): Promise<User | null> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();

      if (result.success) {
        const token = result.data.token;

        Cookies.set('token', token, {
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        });

        toast.success('Login Berhasil!');
        return {
          id: "1",
          name: "ADMINISTRATOR"
        };
      }

      return null;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login gagal!');
      return null;
    }
  }

  static async logout(): Promise<boolean> {
    try {
      const token = Cookies.get("token")
      if (token) {
        Cookies.remove("token")
        toast.success('Berhasil Logout!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout gagal!');
      return false;
    }
  }
}
