import AppHeader from '@/components/AppHeader'
import { NavigationProvider } from '@/context/NavigationContext'
import { t } from '@/src/i18nConfig'
import '@/styles/globals.css'
import '@/styles/skeletons.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: t('metadata_title'),
  description: t('metadata_description')
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <NavigationProvider>
          <AppHeader />
          {children}
        </NavigationProvider>
      </body>
    </html>
  )
}
