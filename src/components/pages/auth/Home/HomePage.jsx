import React from 'react'
import Layouts from '../../../layouts'
import clsx from 'clsx'
import { Card } from '../../../material/Card'
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

export const HomePage = () => {

  const [option, setOption] = React.useState(1);

  const languages = [
    { name: 'Spanish', level: 100 },
    { name: 'English', level: 50 },
    { name: 'Russian', level: 20 },
  ];

  const habilities = [
    { name: 'Javascript', level: 85 },
    { name: 'PHP', level: 60 },
    { name: 'Solidity', level: 90 },
    { name: 'Python', level: 75 },
    { name: 'C++ / C#', level: 60 },
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

  const experience = [
    {
      website: "https://www.mercadolibre.com.co/",
      role: "System Developer",
      company: "Mercado Libre Colombia",
      icon: 'images/meli.jpg',
      type: {
        id: 1,
        title: "Full-time",
      },
      startAt: "2024-03-12",
      endsAt: "2025-03-06",
      location: "Bogotá, Colombia",
    },
  
    {
      website: "https://memboinventos.pro/",
      role: "Fullstack Developer",
      company: "Membo Inventos S.A.S",
      icon: 'images/membo.jpg',
      type: {
        id: 1,
        title: "Full-remote",
      },
      startAt: "2023-05-12",
      endsAt: "2024-03-06",
      location: "Bogotá, Colombia",
    },

    {
      website: "https://academlo.com/",
      role: "Fullstack Developer",
      company: "Academlo",
      icon: 'images/academlo.jpg',
      type: {
        id: 1,
        title: "Internships",
      },
      startAt: "2022-12-01",
      endsAt: "2022-12-30",
      location: "Bogotá, Colombia",
    },

    {
      website: null,
      role: "Systems Supervisor",
      company: "Cybertay",
      icon: null,
      type: {
        id: 1,
        title: "Full-time",
      },
      startAt: "2020-01-01",
      endsAt: "2022-10-30",
      location: "Atlántico, Colombia",
    },

    {
      website: 'https://fluidattacks.com/',
      role: "Ethical Hacker",
      company: "Fluid Attacks",
      icon: 'images/fluidattacks.jpg',
      type: {
        id: 1,
        title: "Full-time",
      },
      startAt: "2018-11-01",
      endsAt: "2019-01-15",
      location: "Medellín, Colombia",
    },

    {
      website: 'http://www.calzadosjunior.com/',
      role: "Administrative Assistant",
      company: "Calzados Junior",
      icon: 'images/calzados_junior.jpg',
      type: {
        id: 1,
        title: "Full-time",
      },
      startAt: "2016-06-01",
      endsAt: "2017-11-15",
      location: "Caracas, Venezuela",
    },

  ];

  const certificates = [
    { 
      id: 1,
      title: "Fullstack Developer Intership",
      image: "images/certificates/1.png"
    },

    { 
      id: 2,
      title: "Ethical Hacking Professional",
      image: "images/certificates/2.jpg"
    },

    { 
      id: 3,
      title: "Front-End Developer",
      image: "images/certificates/3.png"
    },

    { 
      id: 4,
      title: "Back-End Developer",
      image: "images/certificates/4.png"
    },

    { 
      id: 5,
      title: "Ethical Hacking",
      image: "images/certificates/5.png"
    },

    { 
      id: 6,
      title: "Fundations in HTML, CSS and Javascript",
      image: "images/certificates/6.png"
    },

    { 
      id: 7,
      title: "Fullstack Web Developer",
      image: "images/certificates/7.png"
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
          </div>
        </div>
      </div>
    </Layouts.Landing>
  )
}

