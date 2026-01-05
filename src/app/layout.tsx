import AppHeader from '@/components/ui/AppHeader'
import { FeedbackToast } from '@/components/ui/FeedbackToast'
import { FeedbackProvider } from '@/context/FeedbackContext'
import { LoadingProvider } from '@/context/LoadingContext'
import { QueryProvider } from '@/lib/reactQuery/QueryProvider'
import { t } from '@/src/i18nConfig'
import '@/styles/common.css'
import '@/styles/globals.css'
import '@/styles/header.css'
import '@/styles/skeletons.css'
import { getRequestLocale } from '@/utils/headers'
import type { Metadata } from 'next'

// Force dynamic rendering because locale detection reads request headers.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: t('metadata_title'),
  description: t('metadata_description')
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={await getRequestLocale()}>
      <body>
        <QueryProvider>
          <LoadingProvider>
            <FeedbackProvider>
              <FeedbackToast />
              <AppHeader />
              {children}
            </FeedbackProvider>
          </LoadingProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
