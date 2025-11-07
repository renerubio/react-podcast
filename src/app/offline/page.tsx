import { t } from '@/src/i18nConfig'
import Link from 'next/link'

const OfflinePage = () => (
  <main>
    <h1>{t('offline')}</h1>
    <p>{t('error_network')}</p>
    <Link href="/">{t('back_to_home')}</Link>
  </main>
)
export default OfflinePage
