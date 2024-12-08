import React, { createContext, useContext, useState, ReactNode } from 'react'
import { translations } from '../data/translations'

export type Language = 'ja' | 'en' | 'zh'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ja')

  const t = (key: keyof typeof translations) => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
