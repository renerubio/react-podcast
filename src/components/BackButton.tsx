import { useLoading } from '@/context/NavigationContext'
import { stopWithTimeout } from '@/utils/utils'
import Link from 'next/link'
import { t } from '../i18nConfig'

const BackButton = () => {
  const { start, stop } = useLoading()

  const handleLinkClick = () => {
    start('Navigating to home page')
    stopWithTimeout({ stop })
  }
  return (
    <div style={{ marginTop: 16 }}>
      <Link href="/" onClick={handleLinkClick}>
        {t('back_to_home')}
      </Link>
    </div>
  )
}
export default BackButton
