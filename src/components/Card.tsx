/**
 * Renders a customizable card component that wraps its children in a semantic HTML tag
 * specified by the `variant` prop (e.g., 'section', 'article', etc.).
 *
 * @param children - The content to be displayed inside the card.
 * @param className - Additional CSS classes to apply to the card container.
 * @param variant - The HTML tag to use for the card container. Defaults to 'section'.
 * @returns A React element wrapping the children in the specified HTML tag with styling.
 */
const Card = ({
  children,
  className = '',
  variant = 'section'
}: CardProps): React.JSX.Element => {
  const Tag = variant
  return <Tag className={`card ${className}`}>{children}</Tag>
}

export default Card
