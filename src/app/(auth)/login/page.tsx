import LoginCard from '@/features/smartsync-login/components/LoginCard';
import Image from 'next/image';

const Login = () => {
  return (
    <div className="flex justify-center flex-col gap-5 items-center h-screen">
      <Image src="./logo_indibiz.svg" width={140} height={140} alt='indibiz'/>
      <LoginCard />
    </div>
  );
};

export default Login;
