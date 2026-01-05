import { ICardProps } from '@/utils/interfaces'

/**
 * Renders a customizable card component that wraps its children in a semantic HTML tag
 * specified by the `variant` prop (e.g., `section`, `article`).
 *
 * @param props - Component props.
 * @param props.children - Content to render inside the card.
 * @param props.className - Additional CSS classes for the card container.
 * @param props.variant - HTML tag to use for the card container.
 * @returns React element wrapping the children in the specified HTML tag with styling.
 *
 * @example
 * ```tsx
 * <Card variant="section">Content</Card>
 * ```
 */
const Card = ({
  children,
  className = '',
  variant = 'section'
}: ICardProps): React.JSX.Element => {
  const Tag = variant
  return <Tag className={`card ${className}`}>{children}</Tag>
}

export default Card
