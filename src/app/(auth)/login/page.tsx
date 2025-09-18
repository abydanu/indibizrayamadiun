import LoginCard from '@/features/smartsync-login/components/login-card';
import { ThemeLogo } from '@/shared/components/custom/ThemeLogo';

const Login = () => {
  return (
    <div className="flex justify-center flex-col gap-5 items-center h-screen">
      <ThemeLogo width={140} height={140} alt='indibiz'/>
      <LoginCard />
    </div>
  );
};

export default Login;
