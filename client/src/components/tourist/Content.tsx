import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useLanguage } from '../../contexts/LanguageContext'
import { Header } from './Header'
import useSWR from 'swr'
import { useToast } from "@/hooks/use-toast"
import { translations } from '../../data/translations'
import type { Scene } from '../../types/schema'

export const Content: React.FC = () => {
  const [activeScene, setActiveScene] = useState<string | null>(null)
  const [volume, setVolume] = useState(50)
  
  const { language } = useLanguage()
  const { toast } = useToast()

  const { data: scenes } = useSWR<Scene[]>('/api/scenes')
  const { data: explanation, error, isLoading, mutate: refetchScene } = useSWR(
    activeScene ? `/api/scenes/${activeScene}?lang=${language}` : null,
    {
      onError: (err) => {
        console.error('Error fetching scene data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        toast({
          title: translations.error[language],
          description: errorMessage,
          variant: "destructive",
        });
      },
      retryOnError: false
    }
  )

  const spotNumbers = scenes?.sort((a, b) => a.id - b.id).map(scene => scene.id.toString()) || []

  return (
    <div className="flex flex-col h-screen bg-white p-4">
      <Header volume={volume} setVolume={setVolume} />

      <main className="flex-grow overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {spotNumbers.map((num, index) => {
            const scene = scenes?.find(s => s.id === parseInt(num))
            if (!scene) return null;
            
            return (
              <Button
                key={num}
                onClick={() => setActiveScene(num)}
                variant={activeScene === num ? "default" : "outline"}
                className="aspect-square p-0 overflow-hidden relative group hover:scale-105 transition-transform w-full h-full min-h-[250px] bg-white border border-gray-200 rounded-2xl"
              >
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <img
                    src={scene.imageUrl}
                    alt={`${scene.name} - Tourist Spot in Tokyo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.src = '/fallback-image.svg';
                      img.classList.add('object-contain', 'p-4');
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-2">
                  <span className="text-2xl font-bold text-white mb-2">{index + 1}</span>
                  <span className="text-white text-center font-medium">{scene.name}</span>
                </div>
              </Button>
            )
          })}
        </div>
      </main>

      <footer className="mt-4 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-center text-muted-foreground">{translations.loading[language]}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-red-500">{translations.error[language]}</p>
            <Button 
              variant="outline" 
              onClick={() => refetchScene()}
              className="transition-all hover:scale-105"
            >
              {translations.retry[language]}
            </Button>
          </div>
        ) : (
          <p className="text-center text-lg leading-relaxed">{explanation || ''}</p>
        )}
      </footer>
    </div>
  )
}
