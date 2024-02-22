export const Card = ({ children, title = null, className = "", containerClass = "", as: As = "div", full = true }) => {
  return (
    <As className={`border border-light-primary-500 dark:border-dark-primary-500 rounded-md flex flex-col ${full && 'w-full'} ${containerClass}`}>
        <div className={`p-3 ${className}`}>
            {children}
        </div>
    </As>
  )
}
