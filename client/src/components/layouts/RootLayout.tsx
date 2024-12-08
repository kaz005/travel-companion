import React from 'react'
import { Toaster } from "@/components/ui/toaster"

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
