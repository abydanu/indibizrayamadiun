import SmartForm from '@/features/indibizrayamadiun-form/components/indibizrayamadiun-form'
import Footer from '@/shared/components/custom/footer'
import Navbar from '@/shared/components/custom/navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="pt-24 pb-24 flex justify-center">
        <div className="w-full max-w-6xl px-6">
          <h1 className="md:text-2xl text-xl font-extrabold text-center mb-8">
            INPUT INDIBIZ {" "}
            <span className='md:inline block'>TELKOM MADIUN RAYA</span>
          </h1>
          <SmartForm />
        </div>
      </section>
      <Footer />
    </>
  )
}
