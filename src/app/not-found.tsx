"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/button'

const NotFound = () => {
  const navigate = useRouter()
  
  return (
    <div className='h-svh bg-background'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold text-red-700'>404</h1>
        <span className='font-medium text-foreground'>Ups! Halaman tidak ditemukan!</span>
        <p className='text-muted-foreground text-center'>
          Sepertinya halaman yang Anda cari <br />
          tidak ada atau mungkin telah dihapus.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Kembali
          </Button>
          <Button onClick={() => navigate.push('/' )}>Kembali ke Beranda</Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound;