import { IBM_Plex_Sans_Arabic, Tajawal } from 'next/font/google'

export const sansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-sans-arabic',
})

export const headerFont = Tajawal({
  subsets: ['arabic'],
  weight: ['700'],
  variable: '--font-header',
})