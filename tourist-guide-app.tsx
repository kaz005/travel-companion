'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Home, Volume2 } from 'lucide-react'

// 言語タイプの定義
type Language = 'ja' | 'en' | 'zh'

// 翻訳データの定義
const translations = {
  mainMenu: {
    ja: 'メインメニュー',
    en: 'Main Menu',
    zh: '主菜单'
  },
  loading: {
    ja: '読み込み中...',
    en: 'Loading...',
    zh: '加载中...'
  },
  volume: {
    ja: '音量',
    en: 'Volume',
    zh: '音量'
  },
}

// 言語コンテキストの型定義
type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// 言語コンテキストの作成
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 言語プロバイダーコンポーネント
const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ja')

  const t = (key: string) => translations[key as keyof typeof translations]?.[language] || key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// 言語フックの定義
const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// ヘッダーコンポーネント
const Header: React.FC<{ volume: number; setVolume: (value: number) => void }> = ({ volume, setVolume }) => {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow">
      <Button variant="outline" size="icon">
        <Home className="h-4 w-4" />
        <span className="sr-only">{t('mainMenu')}</span>
      </Button>
      <div className="flex items-center space-x-2">
        <Volume2 className="h-4 w-4" />
        <Slider
          value={[volume]}
          onValueChange={(value) => setVolume(value[0])}
          max={100}
          step={1}
          className="w-24"
        />
        <span className="sr-only">{t('volume')}</span>
      </div>
      <div className="flex space-x-2">
        <Button variant={language === 'ja' ? "default" : "outline"} onClick={() => setLanguage('ja')}>日本語</Button>
        <Button variant={language === 'en' ? "default" : "outline"} onClick={() => setLanguage('en')}>English</Button>
        <Button variant={language === 'zh' ? "default" : "outline"} onClick={() => setLanguage('zh')}>中文</Button>
      </div>
    </header>
  )
}

// APIコールをシミュレートする関数
const simulateApiCall = async (sceneId: string, language: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const explanations = {
    ja: `シーン${sceneId}の説明がここに表示されます。`,
    en: `Explanation for Scene ${sceneId} will be displayed here.`,
    zh: `场景${sceneId}的说明将显示在这里。`
  }
  return explanations[language as keyof typeof explanations] || explanations.en
}

// メインコンテンツコンポーネント
const TouristGuideContent: React.FC = () => {
  const [activeScene, setActiveScene] = useState<string | null>(null)
  const [explanation, setExplanation] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [volume, setVolume] = useState(50)
  
  const { language, t } = useLanguage()

  const handleSceneClick = async (sceneId: string) => {
    setActiveScene(sceneId)
    setIsLoading(true)
    const response = await simulateApiCall(sceneId, language)
    setExplanation(response)
    setIsLoading(false)
  }

  const scenes = [
    "東京タワー", "浅草寺", "渋谷スクランブル交差点", "皇居",
    "上野公園", "お台場", "新宿御苑", "築地市場"
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <Header volume={volume} setVolume={setVolume} />

      <main className="flex-grow overflow-auto">
        <div className="grid grid-cols-2 gap-4">
          {scenes.map((scene, index) => (
            <Button
              key={index}
              onClick={() => handleSceneClick((index + 1).toString())}
              variant={activeScene === (index + 1).toString() ? "default" : "outline"}
              className="h-20 text-sm"
            >
              {scene}
            </Button>
          ))}
        </div>
      </main>

      <footer className="mt-4 bg-white p-4 rounded-lg shadow">
        {isLoading ? (
          <p className="text-center">{t('loading')}</p>
        ) : (
          <p className="text-center">{explanation}</p>
        )}
      </footer>
    </div>
  )
}

// メインアプリケーションコンポーネント
export default function TouristGuideApp() {
  return (
    <LanguageProvider>
      <TouristGuideContent />
    </LanguageProvider>
  )
}