import React from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Home, Volume2, Settings } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { Link } from 'wouter'

interface HeaderProps {
  volume: number
  setVolume: (value: number) => void
}

export const Header: React.FC<HeaderProps> = ({ volume, setVolume }) => {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow">
      <div className="flex space-x-2">
        <Button variant="outline" size="icon">
          <Home className="h-4 w-4" />
          <span className="sr-only">{t('mainMenu')}</span>
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Dashboard</span>
          </Button>
        </Link>
      </div>
      <div className="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
        <Volume2 className="h-4 w-4 text-slate-600" />
        <Slider
          value={[volume]}
          onValueChange={(value) => setVolume(value[0])}
          max={100}
          step={1}
          className="w-32"
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
