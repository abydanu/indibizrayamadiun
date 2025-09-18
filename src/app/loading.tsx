"use client"

import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className='h-svh bg-background'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-4'>
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <span className='text-lg font-medium text-foreground'>Memuat...</span>
        </div>
        <p className='text-muted-foreground text-center'>
          Mohon tunggu sebentar
        </p>
      </div>
    </div>
  )
}
