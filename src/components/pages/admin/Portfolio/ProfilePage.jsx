import React from 'react'
import {
  BadgeOutlined, WorkOutlined, PlaceOutlined, PublicOutlined,
  DescriptionOutlined, CameraAltOutlined, MailOutlined, PhoneOutlined,
  LanguageOutlined, LinkedIn, GitHub, WhatsApp, DriveFileRenameOutlineOutlined,
} from '@mui/icons-material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel, SuccessMessage } from '../../../ui'
import { Button } from '../../../material/Button'
import { Input } from '../../../material/Input'

const BASE = `${API_ROUTES.ADMIN}/settings`

// Mirrors the keys seeded under the "landing" category
const FIELDS = [
  { key: 'profile_name',       label: 'Full name',  icon: BadgeOutlined,      placeholder: 'Your name' },
  { key: 'profile_roles',      label: <>Roles <span className="font-normal text-neutral-400">— separated by commas</span></>, icon: WorkOutlined, placeholder: 'Fullstack Developer, UI/UX Designer' },
  { key: 'location_residence', label: 'Country',    icon: PublicOutlined,     placeholder: 'Colombia' },
  { key: 'location_city',      label: 'City',       icon: PlaceOutlined,      placeholder: 'Bogotá D.C' },
]

// Shared by the landing footer and the downloadable CV. Links are stored as
// full URLs because the footer opens them; the CV drops the protocol when it
// prints them. Leaving one empty hides its icon in the footer.
const CONTACT_FIELDS = [
  { key: 'contact_email',     label: 'Email',    icon: MailOutlined,  placeholder: 'you@example.com' },
  { key: 'contact_phone',     label: 'Phone',    icon: PhoneOutlined, placeholder: '+57 300 000 0000' },
  { key: 'contact_phone_alt', label: <>Second phone <span className="font-normal text-neutral-400">(optional)</span></>, icon: PhoneOutlined, placeholder: '+57 300 000 0000' },
  { key: 'contact_website',   label: 'Website',  icon: LanguageOutlined, placeholder: 'https://cyberstein.net' },
  { key: 'contact_linkedin',  label: 'LinkedIn', icon: LinkedIn,      placeholder: 'https://www.linkedin.com/in/username' },
  { key: 'contact_github',    label: 'GitHub',   icon: GitHub,        placeholder: 'https://github.com/username' },
  { key: 'contact_whatsapp',  label: 'WhatsApp', icon: WhatsApp,      placeholder: 'https://wa.link/...' },
]

export const ProfilePage = () => {
  const fileRef = React.useRef(null)
  const [values, setValues] = React.useState({})
  const [avatar, setAvatar] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      // Three categories: "landing" holds the profile copy, "social" the CV
      // contact keys, "project" the brand name every outgoing email signs with.
      const [landing, social, project] = await Promise.all([
        api.get(`${BASE}/config`, { params: { category: 'landing' } }),
        api.get(`${BASE}/config`, { params: { category: 'social' } }),
        api.get(`${BASE}/config`, { params: { category: 'project' } }),
      ])
      const map = Object.fromEntries(
        [...landing.data, ...social.data, ...project.data].map(row => [row.key, row.value])
      )
      setValues(map)
      setAvatar(map.profile_avatar || null)
    } catch { } finally { setLoading(false) }
  }, [])

  React.useEffect(() => { load() }, [load])

  const save = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      await api.patch(`${BASE}/config`, {
        values: {
          profile_name:       values.profile_name || '',
          profile_roles:      values.profile_roles || '',
          location_residence: values.location_residence || '',
          location_city:      values.location_city || '',
          about_me:           values.about_me || '',
          ...Object.fromEntries(CONTACT_FIELDS.map(f => [f.key, values[f.key] || ''])),
          project_name:       values.project_name || '',
        },
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  const uploadAvatar = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError('Image must be smaller than 2MB'); return }

    setUploading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('avatar', file)
      const { data } = await api.post(`${BASE}/config/avatar`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setAvatar(data.avatar)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not upload the image')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <p className="text-sm text-neutral-400 text-center py-12">Loading...</p>

  return (
    <>
      <Panel title="Profile picture" description="Shown on the landing profile card">
        <div className="flex items-center gap-4">
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            className="relative size-24 rounded-full overflow-hidden cursor-pointer group shrink-0 bg-portal-border dark:bg-dark-portal-border flex items-center justify-center"
          >
            {avatar
              ? <img src={avatar} className="size-full object-cover" alt="profile" />
              : <CameraAltOutlined sx={{ fontSize: 28 }} className="text-neutral-400" />}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <CameraAltOutlined sx={{ fontSize: 22, color: 'white' }} />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
          <div className="flex flex-col gap-1">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              JPG, PNG, GIF or WebP · Max 2MB
            </p>
            <p className="text-xs text-neutral-400">
              Cropped to a square around the face on upload.
            </p>
            {uploading && <p className="text-xs text-cyan-500">Uploading...</p>}
          </div>
        </div>
      </Panel>

      <Panel title="Profile" description="Name, roles and where you are based">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
            <Input.User
              key={key}
              label={label}
              icon={<Icon sx={{ fontSize: 18 }} />}
              value={values[key] ?? ''}
              onChange={e => setValues({ ...values, [key]: e.target.value })}
              placeholder={placeholder}
            />
          ))}
        </div>

        <Input.User
          as="textarea"
          label={<>About me <span className="font-normal text-neutral-400">— leave a blank line between paragraphs</span></>}
          icon={<DescriptionOutlined sx={{ fontSize: 18 }} />}
          rows={8}
          value={values.about_me ?? ''}
          onChange={e => setValues({ ...values, about_me: e.target.value })}
        />

      </Panel>

      <Panel title="Brand" description="Signs every email the system sends and titles the site">
        <Input.User
          label="Project name"
          icon={<DriveFileRenameOutlineOutlined sx={{ fontSize: 18 }} />}
          value={values.project_name ?? ''}
          onChange={e => setValues({ ...values, project_name: e.target.value })}
          placeholder="Cyberstein"
        />
      </Panel>

      <Panel title="Contact" description="Shown in the landing footer and on your downloadable CV">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONTACT_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
            <Input.User
              key={key}
              label={label}
              icon={<Icon sx={{ fontSize: 18 }} />}
              value={values[key] ?? ''}
              onChange={e => setValues({ ...values, [key]: e.target.value })}
              placeholder={placeholder}
            />
          ))}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center gap-3">
          <Button.User variant="normal" loading={saving} onClick={save}>Save changes</Button.User>
          {success && <SuccessMessage message="Saved" />}
        </div>
      </Panel>
    </>
  )
}
