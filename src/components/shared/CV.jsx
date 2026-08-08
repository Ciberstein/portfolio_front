import { CloudDownload } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import React from 'react'
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { skillsThunk } from '../../store/slices/skills.slice';
import { experienceThunk } from '../../store/slices/experience.slice';
import { educationThunk } from '../../store/slices/education.slice';
import { landingThunk } from '../../store/slices/landing.slice';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// DATEONLY values arrive as "YYYY-MM-DD". Parsing them with new Date() would
// read them as UTC midnight and shift the month backwards in western
// timezones, so the parts are taken from the string itself.
const parts = (value) => {
  if (!value) return null
  const [year, month] = String(value).split('-')
  return { year, month: MONTHS[parseInt(month, 10) - 1] }
}

const stamp = (value) => {
  const p = parts(value)
  return p ? `${p.month} ${p.year}` : ''
}

// Reproduces how the periods read on the printed CV: a single month when start
// and end fall together, just the year when only an end date is known, and
// "Present" for anything still ongoing.
const period = (startAt, endsAt) => {
  if (!startAt && !endsAt) return ''
  if (!startAt) return parts(endsAt).year
  if (!endsAt) return `${stamp(startAt)} - Present`
  const from = stamp(startAt)
  const to = stamp(endsAt)
  return from === to ? from : `${from} - ${to}`
}

// Links are stored as full URLs so the footer can open them. The CV prints
// them as plain text, where the protocol is noise.
const readable = (url) =>
  (url || '').replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')

// Bullets are stored one per line
const bullets = (description) =>
  (description || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)

const Document = ({ contentRef, settings, languages, skills, education, experience }) => {

  const technologies = skills.filter(s => s.category === 'technology')
  const programming = skills.filter(s => s.category !== 'technology')

  const contact = [
    settings.contact_email,
    languages.map(l => l.name).join(' / '),
  ].filter(Boolean)

  const phones = [settings.contact_phone, settings.contact_phone_alt].filter(Boolean)

  const links = [settings.contact_website, settings.contact_linkedin]
    .filter(Boolean)
    .map(readable)

  return (
    <div className="hidden">
      <div ref={contentRef} className="px-6 py-4 flex flex-col gap-4">
        <h1 className="text-2xl text-center font-medium">{settings.profile_name}</h1>
        <div className="grid grid-cols-3 gap-2 w-full text-sm">

          <div className="flex flex-col items-start">
            {contact.map(line => (
              <span key={line} className="text-zinc-600">{line}</span>
            ))}
          </div>
          <div className="flex flex-col items-center">
            {phones.map(phone => (
              <span key={phone} className="text-zinc-600">{phone}</span>
            ))}
          </div>
          <div className="flex flex-col items-end">
            {links.map(link => (
              <span key={link} className="text-zinc-600">{link}</span>
            ))}
          </div>

        </div>

        {skills.length > 0 && (
          <section className="flex flex-col gap-2">

            <div className="border-b">
              <h3 className="text-xl font-medium">Habilidades</h3>
            </div>


            <div className="grid grid-cols-2 gap-4">


              {technologies.length > 0 && (
                <div className="flex flex-col">
                  <span className="font-medium">Tecnologías:</span>
                  <ul className="grid! grid-cols-3! w-full! text-sm! raw-html">
                    {technologies.map(s => <li key={s.id}>{s.name}</li>)}
                  </ul>
                </div>
              )}


              {programming.length > 0 && (
                <div className="flex flex-col">
                  <span className="font-medium">Lenguajes de programación:</span>
                  <ul className="grid! grid-cols-3! w-full! text-sm! raw-html">
                    {programming.map(s => <li key={s.id}>{s.name}</li>)}
                  </ul>
                </div>
              )}

            </div>


          </section>
        )}


        {education.length > 0 && (
          <section className="flex flex-col gap-2">

            <div className="border-b">
              <h3 className="text-xl font-medium">Educación</h3>
            </div>

            <div className="flex flex-col gap-2">

              {education.map(item => (
                <div key={item.id} className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-start col-span-2">
                    <span className="font-medium">{item.institution}</span>
                    <span className="italic text-zinc-600 text-sm">{item.title}</span>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <span className="text-sm">{period(item.startAt, item.endsAt)}</span>
                  </div>
                </div>
              ))}

            </div>

          </section>
        )}

        {experience.length > 0 && (
          <section className="flex flex-col gap-2">

            <div className="border-b">
              <h3 className="text-xl font-medium">Experiencia Laboral</h3>
            </div>

            <div className="flex flex-col gap-2">

              {experience.map(item => (
                <div key={item.id} className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-start col-span-2">
                    <span className="font-medium">{item.company}</span>
                    <span className="italic text-zinc-600 text-sm">{item.role}</span>
                    {bullets(item.description).length > 0 && (
                      <ul className="text-sm! raw-html">
                        {bullets(item.description).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <span className="text-sm">{item.location}</span>
                    <span className="text-sm">{period(item.startAt, item.endsAt)}</span>
                  </div>
                </div>
              ))}

            </div>

          </section>
        )}


      </div>
    </div>
  );
};


export const CV = () => {

  const contentRef  = React.useRef();
  const dispatch = useDispatch();

  const landing    = useSelector(state => state.landing);
  const skills     = useSelector(state => state.skills);
  const experience = useSelector(state => state.experience);
  const education  = useSelector(state => state.education);

  // The download button sits in the footer of every landing page, but only the
  // home page loads this data. Whatever is still missing is fetched here so the
  // CV is never printed half empty.
  React.useEffect(() => {
    if (!skills.length)     dispatch(skillsThunk());
    if (!experience.length) dispatch(experienceThunk());
    if (!education.length)  dispatch(educationThunk());
    if (!landing.languages.length) dispatch(landingThunk());
  }, []);

  const settings = landing.settings || {};

  const documentTitle = `${settings.profile_name || 'CV'} - CV`

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
      <Document
        contentRef={contentRef}
        settings={settings}
        languages={landing.languages}
        skills={skills}
        education={education}
        experience={experience}
      />
    </Tooltip>
  )
}
