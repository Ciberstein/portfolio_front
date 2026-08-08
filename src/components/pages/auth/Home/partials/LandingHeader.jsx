import { Typewriter } from 'react-simple-typewriter'
import clsx from 'clsx'

const messages = [
  'Bienvenido a mi espacio de trabajo',
  'Welcome to my workplace',
  'Добро пожаловать в моё рабочее пространство!',
  'Bienvenue dans mon espace de travail',
  'Benvenuti nel mio spazio di lavoro',
  'Willkommen in meinem Arbeitsbereich',
  '私のワークスペースへようこそ',
];

export const LandingHeader = () => {
  return (
    <header className={clsx(
      "flex flex-col gap-4 items-center",
    )}>
      <div className={clsx(
        "flex gap-4 justify-center w-full",
        "bg-linear-to-t from-light-primary-500 via-light-primary-500/50 to-transparent",
        "dark:from-dark-primary-500 dark:via-dark-primary-500/50 dark:to-transparent",
        "grow px-px overflow-hidden p-px pt-0",
      )}>
        <div className={clsx(
          "flex flex-col gap-4 items-center p-4",
          "bg-light-secondary-500 dark:bg-dark-secondary-500 size-full",
        )}>
          <h1 className={clsx("text-3xl lg:text-5xl text-center font-glitch",
            "text-light-primary-500 dark:text-white glitch"
          )} data-text={"Cyberstein Labs"}>
            Cyberstein Labs
          </h1>
          <h3 className="text-green-400">
            <Typewriter
              words={messages}
              loop={0}
              cursor
              cursorStyle="█"
              typeSpeed={80}
              deleteSpeed={80}
              delaySpeed={3000}
            />
          </h3>              
        </div>
      </div>

      <div className="flex flex-wrap lg:justify-between gap-4 w-full">
        <div className="flex gap-2 font-medium text-xl">
          <span className="text-cyan-500 dark:text-dark-primary-500">9+</span>
          <span className="uppercase text-nowrap">Years of Experience</span>
        </div>
        <div className="flex gap-2 font-medium text-xl">
          <span className="text-cyan-500 dark:text-dark-primary-500">10+</span>
          <span className="uppercase text-nowrap">Completed projects</span>
        </div>
        <div className="flex gap-2 font-medium text-xl">
          <span className="text-cyan-500 dark:text-dark-primary-500">20+</span>
          <span className="uppercase text-nowrap">Happy Customers</span>
        </div>
      </div>

    </header>
  )
}
