import { en } from './locale/en'

export const messages = { en }

export type Locale = keyof typeof messages

export function t(key: string, locale: Locale = 'en'): string {
  return messages[locale][key] || key
}
