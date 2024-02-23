export const GlitchCard = ({ children, className = "", as: As = "div" }) => {
  return (
    <As className={`p-4 font-mono bg-light-primary-500/10 dark:bg-dark-primary-500/10 dark:text-dark-primary-500 clip-angle ${className}`}>
      {children}
    </As>
  )
}
