'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Lang = 'en' | 'zh' | 'es'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (en: string, zh: string, es?: string) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('tcp_lang') as Lang | null
    if (stored === 'zh' || stored === 'es') setLangState(stored)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('tcp_lang', l)
  }

  function t(en: string, zh: string, es?: string) {
    if (lang === 'zh') return zh
    if (lang === 'es') return es ?? en
    return en
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
