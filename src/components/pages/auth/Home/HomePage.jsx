import React from 'react'
import Layouts from '../../../layouts'
import clsx from 'clsx'
import { Card } from '../../../ui'
import { Languages } from './partials/Languages'
import { Profile } from './partials/Profile'
import { Location } from './partials/Location'
import { Habilities } from './partials/Habilities'
import { LandingHeader } from './partials/LandingHeader'
import { AboutMe } from './partials/AboutMe'
import { Services } from './partials/Services'
import { DetailsNavbar } from './partials/DetailsNavbar'
import { Experience } from './partials/Experience'
import { Certificates } from './partials/Certificates'
import { Projects } from './partials/Projects'
import { useDispatch, useSelector } from 'react-redux'
import { certificatesThunk } from '../../../../store/slices/certificates.slice'
import { skillsThunk } from '../../../../store/slices/skills.slice'
import { experienceThunk } from '../../../../store/slices/experience.slice'
import { projectsThunk } from '../../../../store/slices/projects.slice'
import { landingThunk } from '../../../../store/slices/landing.slice'

export const HomePage = () => {

  const [option, setOption] = React.useState(1);
  const dispatch = useDispatch();
  const certificates = useSelector(state => state.certificates);
  const habilities = useSelector(state => state.skills);
  const experience = useSelector(state => state.experience);
  const projects = useSelector(state => state.projects);
  const landing = useSelector(state => state.landing);

  React.useEffect(() => {
    dispatch(certificatesThunk());
    dispatch(skillsThunk());
    dispatch(experienceThunk());
    dispatch(projectsThunk());
    dispatch(landingThunk());
  }, []);


  return (
    <Layouts.Landing>
      <div className={clsx(
        "size-full grid gap-4",
        "grid-cols-1 xl:grid-cols-4"
      )}>
        <div className={clsx(
          "flex flex-col items-center gap-4",
          "h-full xl:overflow-auto",
        )}>
          <Profile data={landing.settings} />
          <Location data={landing.settings} />
          <Languages data={landing.languages} />
          <Habilities data={habilities} />
        </div>
        <div className={clsx(
          "xl:col-span-3",
          "h-full xl:overflow-auto",
          "flex flex-col gap-4",
        )}>
          <LandingHeader />
          <AboutMe data={landing.settings.about_me} />

          <div className="flex flex-col gap-4">
            <DetailsNavbar option={option} setOption={setOption} />
            { option === 1 && <Services data={landing.services} /> }
            { option === 2 && <Experience data={experience} /> }
            { option === 3 && <Certificates data={certificates} /> }
            { option === 4 && <Projects data={projects} /> }
          </div>
        </div>
      </div>
    </Layouts.Landing>
  )
}

