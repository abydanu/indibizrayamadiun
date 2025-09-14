import SmartForm from '@/features/smartsync-form/components/SmartSyncForm'
import Navbar from '@/shared/components/Navbar'
import Footer from '@/shared/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="pt-24 pb-24 flex justify-center">
        <div className="w-full max-w-6xl px-6">
          <h1 className="md:text-2xl text-xl font-extrabold text-center mb-8">
            INPUT INDIBIZ WITEL MADIUN
          </h1>
          <SmartForm />
        </div>
      </section>
      <Footer />
    </>
  )
}
