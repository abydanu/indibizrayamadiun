"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/button'

const Forbidden = () => {
  const navigate = useRouter()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold text-red-700'>403</h1>
        <span className='font-medium'>Access Forbidden</span>
        <p className='text-muted-foreground text-center'>
          Anda tidak memiliki izin yang diperlukan  <br />
          untuk melihat halaman atau konten ini.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Kembali
          </Button>
          <Button onClick={() => navigate.push( '/' )}>Kembali ke Beranda</Button>
        </div>
      </div>
    </div>
  )
}

export default Forbidden;