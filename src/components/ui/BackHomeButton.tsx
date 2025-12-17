import { useLoading } from '@/hooks/useLoading'

import { useFeedback } from '@/hooks/useFeedback'
import { t } from '@/src/i18nConfig'
import { stopLoadingWithTimeout } from '@/utils/utils'
import Link from 'next/link'

const BackHomeButton = () => {
  const { stopLoading } = useLoading()
  const { newMessage } = useFeedback()

  const handleLinkClick = () => {
    newMessage(t('loading_top_podcasts'))
    stopLoadingWithTimeout({ stopLoadingHandler: stopLoading })
  }
  return (
    <div style={{ marginTop: 16 }}>
      <Link href="/" onClick={handleLinkClick}>
        {t('back_to_home')}
      </Link>
    </div>
  )
}
export default BackHomeButton
