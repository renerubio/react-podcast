import AppHeader from '@/components/AppHeader'
import NavIndicator from '@/components/NavIndicator'
import { NavigationProvider } from '@/context/NavigationContext'
import { t } from '@/src/i18nConfig'
import type { Metadata } from 'next'
import './globals.css'

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
          <NavIndicator />
          <main>{children}</main>
        </NavigationProvider>
      </body>
    </html>
  )
}
