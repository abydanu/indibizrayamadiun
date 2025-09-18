"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const navigate = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='h-svh bg-background'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-16 h-16 text-red-500" />
          <h1 className='text-[5rem] leading-tight font-bold text-red-700'>500</h1>
        </div>
        <span className='font-medium text-foreground'>Terjadi Kesalahan!</span>
        <p className='text-muted-foreground text-center'>
          Maaf, terjadi kesalahan pada server. <br />
          Silakan coba lagi atau hubungi administrator.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => navigate.push('/')}>
            Kembali ke Beranda
          </Button>
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" onClick={() => window.location.reload()}/>
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  )
}
