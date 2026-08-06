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
import { Brush, CurrencyBitcoin, Laptop, Storage, Terminal, Web } from '@mui/icons-material'
import { DetailsNavbar } from './partials/DetailsNavbar'
import { Experience } from './partials/Experience'
import { Certificates } from './partials/Certificates'
import { Projects } from './partials/Projects'
import { useDispatch, useSelector } from 'react-redux'
import { certificatesThunk } from '../../../../store/slices/certificates.slice'
import { skillsThunk } from '../../../../store/slices/skills.slice'
import { experienceThunk } from '../../../../store/slices/experience.slice'
import { projectsThunk } from '../../../../store/slices/projects.slice'

export const HomePage = () => {

  const [option, setOption] = React.useState(1);
  const dispatch = useDispatch();
  const certificates = useSelector(state => state.certificates);
  const habilities = useSelector(state => state.skills);
  const experience = useSelector(state => state.experience);
  const projects = useSelector(state => state.projects);

  React.useEffect(() => {
    dispatch(certificatesThunk());
    dispatch(skillsThunk());
    dispatch(experienceThunk());
    dispatch(projectsThunk());
  }, []);

  const languages = [
    { name: 'Spanish', level: 100 },
    { name: 'English', level: 50 },
    { name: 'Russian', level: 20 },
  ];

  const services = [
    { 
      icon: <Laptop sx={{ fontSize: 45 }} />,
      title: "DApps",
      description: "Projects under the web3 system and implementation of transactions with cryptocurrencies."
    },

    { 
      icon: <CurrencyBitcoin sx={{ fontSize: 45 }} />,
      title: "Smart Contracts",
      description: "Creation and deployment of smart contracts in solidity, ERC20 and ERC721 Tokens."
    },

    { 
      icon: <Web sx={{ fontSize: 45 }} />,
      title: "Web development",
      description: "Front-end and back-end web development, login system and data management and more..."
    },

    { 
      icon: <Brush sx={{ fontSize: 45 }} />,
      title: "Web design",
      description: "Web user interface customized to suit the client under CSS3, Tailwind and Bootstrap."
    },

    { 
      icon: <Storage sx={{ fontSize: 45 }} />,
      title: "DB Management",
      description: "Architecture design and management of MongoDB, PostgresSQL, MySQL and SQLServer databases."
    },

    { 
      icon: <Terminal sx={{ fontSize: 45 }} />,
      title: "Software development",
      description: "Design and development of cross-platform desktop applications."
    },

  ];




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
          <Profile />
          <Location />
          <Languages data={languages} />
          <Habilities data={habilities} />
        </div>
        <div className={clsx(
          "xl:col-span-3",
          "h-full xl:overflow-auto",
          "flex flex-col gap-4",
        )}>
          <LandingHeader />
          <AboutMe />

          <div className="flex flex-col gap-4">
            <DetailsNavbar option={option} setOption={setOption} />
            { option === 1 && <Services data={services} /> }
            { option === 2 && <Experience data={experience} /> }
            { option === 3 && <Certificates data={certificates} /> }
            { option === 4 && <Projects data={projects} /> }
          </div>
        </div>
      </div>
    </Layouts.Landing>
  )
}

