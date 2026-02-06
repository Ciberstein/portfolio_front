import { CloudDownload } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import React from 'react'
import clsx from 'clsx';
import { useReactToPrint } from 'react-to-print';


const Document = ({ contentRef, data }) => {


  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  return (
    <div className="hidden">
      <div ref={contentRef} className="px-6 py-4 flex flex-col gap-4">
        <h1 className="text-2xl text-center font-medium">Luis Daniel Rojas Urdaneta</h1>
        <div className="grid grid-cols-3 gap-2 w-full">

          <div className="flex flex-col items-start">
            <span className="text-zinc-600">dev.luis.rojas@gmail.com</span>
            <span className="text-zinc-600">Idiomas: Español / Inglés</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-zinc-600">+57 300 335 5560</span>
            <span className="text-zinc-600">+57 302 264 4591</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-zinc-600">cyberstein.net</span>
            <span className="text-zinc-600">linkedin.com/in/cyberstein</span>
          </div>

        </div>

        <section className="flex flex-col gap-2">

          <div className="border-b">
            <h3 className="text-xl font-medium">Habilidades</h3>
          </div>


          <div className="grid grid-cols-2 gap-4">




            <div className="flex flex-col items-start gap-2">
              <span className="font-medium">Tecnologías:</span>
              <div className="grid grid-cols-3 w-full text-sm">
                <span>• CSS</span>
                <span>• React</span>
                <span>• Next.js</span>
                <span>• Docker</span>
                <span>• TypeScript</span>
                <span>• Tailwind</span>
                <span>• Remix</span>
                <span>• Bootstrap</span>
                <span>• Vite</span>
                <span>• jQuery</span>
                <span>• Node.js</span>
                <span>• Git</span>
                <span>• Express</span>
                <span>• Postgres</span>
                <span>• MySQL</span>
                <span>• MongoDB</span>
                <span>• Virtualbox</span>
              </div>
            </div>


            <div className="flex flex-col items-start gap-2">
              <span className="font-medium">Lenguajes de programación:</span>
              <div className="grid grid-cols-3 w-full text-sm">
                <span>• Javascript</span>
                <span>• PHP</span>
                <span>• Python</span>
                <span>• C++</span>
                <span>• C#</span>
                <span>• Solidity</span>
              </div>
            </div>

          </div>


        </section>


        <section className="flex flex-col gap-2">

          <div className="border-b">
            <h3 className="text-xl font-medium">Educación</h3>
          </div>

          <div className="flex flex-col gap-2">

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-start col-span-2">
                <span className="font-medium">Universidad Alejandro Humboldt</span>
                <span className="italic text-zinc-600 text-sm">Ingeniería Informática</span>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-sm">2017</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-start col-span-2">
                <span className="font-medium">Academlo</span>
                <span className="italic text-zinc-600 text-sm">Developer Full-stack</span>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-sm">Dec 2022 - May 2023</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-start col-span-2">
                <span className="font-medium">Seguridad Cero</span>
                <span className="italic text-zinc-600 text-sm">Ethical Hacker Professional</span>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-sm">Feb 2023 - May 2023</span>
              </div>
            </div>

          </div>

        </section>

        <section className="flex flex-col gap-2">

          <div className="border-b">
            <h3 className="text-xl font-medium">Experiencia Laboral</h3>
          </div>

          <div className="flex flex-col gap-2">

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-start col-span-2">
                <span className="font-medium">Mercado Libre Colombia</span>
                <span className="italic text-zinc-600 text-sm">Systems Developer</span>
                <ul className="text-sm! raw-html">
                  <li>Desarrollo y mantenimiento de sistemas internos.</li>
                  <li>Automatización de procesos referentes a soporte de usuario.</li>
                  <li>Diseño y maquetado de aplicaciones.</li>
                  <li>Liderar y proponer iniciativas de desarrollo.</li>
                </ul>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-sm">Bogotá D.C, Colombia</span>
                <span className="text-sm">Mar 2024 - Mar 2025</span>
              </div>
            </div>


            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-start col-span-2">
                <span className="font-medium">Membo Inventos</span>
                <span className="italic text-zinc-600 text-sm">Programador Full-Stack</span>
                <ul className="text-sm! raw-html">
                  <li>Desarrollo de aplicaciones web (backend & frontend) en diversas tecnologías como Laravel, React, Node.js, entre otras.</li>
                  <li>Trabajo en equipo, cumplimiento de proyectos en tiempo récord, desarrollo de sistemas multiplataforma desde cero y continuación de proyectos existentes.</li>
                  <li>Desarrollo de nuevas tecnologías (hardware) únicas en su tipo.</li>
                </ul>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-sm">Bogotá D.C, Colombia</span>
                <span className="text-sm">May 2023 - Mar 2024</span>
              </div>
            </div>


            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-start col-span-2">
                <span className="font-medium">Academlo</span>
                <span className="italic text-zinc-600 text-sm">Programador Full-Stack</span>
                <ul className="text-sm! raw-html">
                  <li>Trabajé en un grupo de programadores web realizando proyectos de desarrollo backend y frontend.</li>
                  <li>Asistí a evaluaciones de desempeño por parte de profesionales en el tema.</li>
                  <li>Desarrolle individualmente y en equipo varias aplicaciones web requeridas por los líderes</li>
                </ul>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-sm">Bogotá D.C, Colombia</span>
                <span className="text-sm">Dec 2022</span>
              </div>
            </div>


            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-start col-span-2">
                <span className="font-medium">Cybertay</span>
                <span className="italic text-zinc-600 text-sm">Supervisor de sistemas</span>
                <ul className="text-sm! raw-html">
                  <li>Encargado del y mantenimiento y actualización del sistema interno de la empresa.</li>
                  <li>Supervisor del personal de desarrollo y soporte técnico del sistema.</li>
                  <li>Manejo y control de infraestructura (servidores, equipos).</li>
                </ul>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-sm">Atlántico, Colombia</span>
                <span className="text-sm">Jan 2020 - Oct 2022</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-start col-span-2">
                <span className="font-medium">Fluid Attacks</span>
                <span className="italic text-zinc-600 text-sm">Supervisor de sistemas</span>
                <ul className="text-sm! raw-html">
                  <li>Detección y reporte de vulnerabilidades de sistemas controlados.</li>
                </ul>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-sm">Medellín, Colombia</span>
                <span className="text-sm">Nov 2018 - Jan 2019</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-start col-span-2">
                <span className="font-medium">Calzados Junior</span>
                <span className="italic text-zinc-600 text-sm">Administrador de sistemas</span>
                <ul className="text-sm! raw-html">
                  <li>Me desempeñé como soporte técnico en áreas de sistemas.</li>
                  <li>Supervisé el funcionamiento de los servidores, bases de datos y plataforma.</li>
                  <li>Desarrollé soluciones informáticas para el manejo interno de empleados.</li>
                </ul>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-sm">Distrito Capital, Venezuela</span>
                <span className="text-sm">Nov 2018 - Jan 2019</span>
              </div>
            </div>


          </div>

        </section>


      </div>
    </div>
  );
};


export const CV = ({ data }) => {

  const contentRef  = React.useRef();

  const documentTitle = `Daniel Rojas - CV`

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle,
  });


  return (
    <Tooltip title={"Download CV"} placement="top">
      <button className={clsx(
        "hover:text-light-primary-500/50 hover:dark:text-dark-primary-500 p-1", 
        "flex items-center justify-center aspect-square cursor-pointer",
      )} onClick={handlePrint} >
        <CloudDownload />
      </button>
      <Document contentRef={contentRef} data={data} />
    </Tooltip>
  )
}
