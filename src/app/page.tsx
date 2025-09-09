import SmartForm from '@/features/smartsync-form/components/SmartSyncForm';
import Navbar from '@/shared/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <section className=''>
        <div className="container">
          <SmartForm />
        </div>
      </section>
    </> 
  );
}
