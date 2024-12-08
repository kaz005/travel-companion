'use client'

import React from 'react'
import { LanguageProvider } from '../contexts/LanguageContext'
import { Content } from '../components/tourist/Content'

export function TouristGuide() {
  return (
    <LanguageProvider>
      <Content />
    </LanguageProvider>
  )
}
