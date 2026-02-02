import clsx from 'clsx'

export const GlitchCard = ({
    as: As = 'div',
    className,
    children,
}) => {
  return (
    <As className={clsx(
      "bg-light-primary-500/10 dark:bg-dark-primary-500/20",
      "dark:bg-[url(/images/overlay-pattern.png)] clip-angle p-4",
      className
    )}>
      {children}
    </As>
  )
}
