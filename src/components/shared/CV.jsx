import { CloudDownload } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import React from 'react'
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { skillsThunk } from '../../store/slices/skills.slice';
import { experienceThunk } from '../../store/slices/experience.slice';
import { educationThunk } from '../../store/slices/education.slice';
import { projectsThunk } from '../../store/slices/projects.slice';
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

// Chrome keeps anchors alive when it prints to PDF, so these stay clickable in
// the downloaded file. Underlined rather than coloured: the CV is printed as
// often as it is opened, and a blue link on paper is just grey.
const Link = ({ href, className = '' }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={clsx('underline', className)}
  >
    {readable(href)}
  </a>
)

// Mirrors SKILL_CATEGORIES in the backend. A fixed contract, not data, so it
// lives here rather than costing a request and a slice for seven strings.
const SKILL_GROUPS = [
  { key: 'language',       label: 'Languages' },
  { key: 'frontend',       label: 'Frontend' },
  { key: 'backend',        label: 'Backend' },
  { key: 'database',       label: 'Databases' },
  { key: 'infrastructure', label: 'Infrastructure & Tools' },
  { key: 'integration',    label: 'Integrations' },
  { key: 'practice',       label: 'Practices' },
]

// A recruiter can act on a CEFR level; a percentage bar means nothing to them.
const CEFR = (level) =>
  level >= 95 ? 'Native' : level >= 80 ? 'C1' : level >= 60 ? 'B2' : level >= 40 ? 'B1' : 'A2'

// Bullets are stored one per line
const bullets = (description) =>
  (description || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)

const Document = ({ contentRef, settings, languages, skills, education, experience, projects }) => {

  const grouped = SKILL_GROUPS
    .map(g => ({ ...g, items: skills.filter(s => s.category === g.key) }))
    .filter(g => g.items.length > 0)

  const location = [settings.location_city, settings.location_residence].filter(Boolean).join(', ')

  // Standard ATS headings, in the order both a parser and a reader expect:
  // who you are, what you have done, what you know, what you built, where you
  // studied. Experience sits above skills because it is the stronger signal.
  return (
    <div className="hidden">
      <div ref={contentRef} className="px-6 py-4 flex flex-col gap-4">

        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-medium">{settings.profile_name}</h1>
          <span className="text-sm text-zinc-600">
            {settings.profile_roles?.[0] || 'Fullstack Developer'}
          </span>
        </div>

        {/* One pipe-separated row rather than a three column grid: parsers read
            it far more reliably, and GitHub outranks a personal site here. */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-zinc-600 border-b pb-3">
          {location && <span>{location}</span>}
          {settings.contact_phone && <span>· {settings.contact_phone}</span>}
          {settings.contact_email && <span>· {settings.contact_email}</span>}
          {settings.contact_linkedin && <span>· <Link href={settings.contact_linkedin} /></span>}
          {settings.contact_github && <span>· <Link href={settings.contact_github} /></span>}
          {settings.contact_website && <span>· <Link href={settings.contact_website} /></span>}
        </div>

        {settings.about_me?.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="border-b">
              <h3 className="text-xl font-medium">Professional Summary</h3>
            </div>
            <div className="flex flex-col gap-1">
              {settings.about_me.map((para, i) => (
                <p key={i} className="text-sm text-zinc-600">{para}</p>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="border-b">
              <h3 className="text-xl font-medium">Experience</h3>
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

        {grouped.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="border-b">
              <h3 className="text-xl font-medium">Skills</h3>
            </div>
            {/* Comma separated under a labelled group: the shape ATS parsers
                score best, and it reads as competencies rather than a pile. */}
            <div className="flex flex-col gap-1">
              {grouped.map(g => (
                <p key={g.key} className="text-sm">
                  <span className="font-medium">{g.label}: </span>
                  <span className="text-zinc-600">{g.items.map(i => i.name).join(', ')}</span>
                </p>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="border-b">
              <h3 className="text-xl font-medium">Projects</h3>
            </div>
            <div className="flex flex-col gap-2">
              {projects.map(item => {
                // The repository is the better reference when both exist: it
                // shows the work, not just the result.
                const link = item.repoUrl || item.liveUrl
                return (
                  <div key={item.id} className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-start col-span-2">
                      <span className="font-medium">{item.title}</span>
                      {item.stack?.length > 0 && (
                        <span className="italic text-zinc-600 text-sm">
                          {item.stack.join(' · ')}
                        </span>
                      )}
                      {item.description && (
                        <span className="text-sm text-zinc-600">{item.description}</span>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-center">
                      {item.type?.title && <span className="text-sm">{item.type.title}</span>}
                      {link && <Link href={link} className="text-sm" />}
                      {item.finishedAt && (
                        <span className="text-sm">{parts(item.finishedAt).year}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="border-b">
              <h3 className="text-xl font-medium">Education</h3>
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

        {languages.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="border-b">
              <h3 className="text-xl font-medium">Languages</h3>
            </div>
            <p className="text-sm text-zinc-600">
              {languages.map(l => `${l.name} (${CEFR(l.level)})`).join(' · ')}
            </p>
          </section>
        )}

      </div>
    </div>
  );
};

// Everything both triggers need: the data, the hidden document and the print
// handler. Only the button around it differs.
const useCV = () => {
  const contentRef = React.useRef();
  const dispatch = useDispatch();

  const landing    = useSelector(state => state.landing);
  const skills     = useSelector(state => state.skills);
  const experience = useSelector(state => state.experience);
  const education  = useSelector(state => state.education);
  const projects   = useSelector(state => state.projects);

  // The button sits in the landing footer and in the admin's portfolio header,
  // and neither page necessarily loaded this data. Whatever is missing is
  // fetched here so the CV is never printed half empty.
  React.useEffect(() => {
    if (!skills.length)     dispatch(skillsThunk());
    if (!experience.length) dispatch(experienceThunk());
    if (!education.length)  dispatch(educationThunk());
    if (!projects.length)   dispatch(projectsThunk());
    if (!landing.languages.length) dispatch(landingThunk());
  }, []);

  const settings = landing.settings || {};

  const print = useReactToPrint({
    contentRef,
    documentTitle: `${settings.profile_name || 'CV'} - CV`,
  });

  const document = (
    <Document
      contentRef={contentRef}
      settings={settings}
      languages={landing.languages}
      skills={skills}
      education={education}
      experience={experience}
      projects={projects}
    />
  );

  return { print, document };
};

// Terminal aesthetic, icon only, for the landing footer.
const Landing = () => {
  const { print, document } = useCV();

  return (
    <Tooltip title={"Download CV"} placement="top">
      <button className={clsx(
        "hover:text-light-primary-500/50 hover:dark:text-dark-primary-500 p-1",
        "flex items-center justify-center aspect-square cursor-pointer",
      )} onClick={print} >
        <CloudDownload />
      </button>
      {document}
    </Tooltip>
  )
}

// For the admin's portfolio header. Speaks the language of that row rather
// than the generic button set: the tabs beside it are pills on a panel
// background with a cyan hover, so this is too.
const User = ({ className = '' }) => {
  const { print, document } = useCV();

  return (
    <button
      type="button"
      onClick={print}
      className={clsx(
        "flex items-center gap-1.5 shrink-0 whitespace-nowrap",
        "px-4 py-1.5 text-sm rounded-full transition-colors cursor-pointer",
        "bg-portal-panel dark:bg-dark-portal-panel",
        "text-neutral-500 dark:text-neutral-400",
        "hover:text-cyan-600 dark:hover:text-cyan-400",
        className,
      )}
    >
      <CloudDownload sx={{ fontSize: 16 }} />
      Download CV
      {document}
    </button>
  )
}

export const CV = { Landing, User }

