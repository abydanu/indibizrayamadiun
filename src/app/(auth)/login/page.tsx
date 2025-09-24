import LoginCard from '@/features/indibizrayamadiun-login/components/login-card';
import { ThemeLogo } from '@/shared/components/custom/theme-logo';

const Login = () => {
  return (
    <div className="flex justify-center flex-col gap-5 items-center h-screen">
      <ThemeLogo width={140} height={140} alt='indibiz'/>
      <LoginCard />
    </div>
  );
};

export default Login;
