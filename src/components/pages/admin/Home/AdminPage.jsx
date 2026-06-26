import React, { Fragment } from 'react'
import clsx from 'clsx'
import { useForm, Controller } from 'react-hook-form'
import { AddOutlined, EditOutlined, DeleteOutlined, ImageOutlined } from '@mui/icons-material'
import { Chip, Dialog, DialogContent, Slider } from '@mui/material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel, Field, Input, Select, PrimaryButton, SecondaryButton } from '../../../ui'

const BASE = `${API_ROUTES.ADMIN}/portfolio`

const dateInput = clsx(
  "w-full px-3 py-2 text-sm rounded-md border transition-colors",
  "bg-portal-surface dark:bg-dark-portal-surface",
  "border-portal-border dark:border-dark-portal-border",
  "text-neutral-900 dark:text-white",
  "focus:outline-none focus:border-cyan-400",
  "[color-scheme:light] dark:[color-scheme:dark]",
)

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'

// ── Certificates ──────────────────────────────────────────────────────────────

const CertificateDialog = ({ item, onClose, onSaved }) => {
  const fileRef = React.useRef(null)
  const [preview, setPreview] = React.useState(item?.image || null)
  const [file, setFile] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { title: item?.title || '' },
  })

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const onSubmit = async (data) => {
    if (!item && !file) { setError('Image is required'); return }
    setLoading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('title', data.title)
      if (file) form.append('image', file)
      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }
      if (item) await api.patch(`${BASE}/certificates/${item.id}`, form, cfg)
      else      await api.post(`${BASE}/certificates`, form, cfg)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving certificate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
          {item ? 'Edit certificate' : 'Add certificate'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div
            onClick={() => fileRef.current?.click()}
            className={clsx(
              "relative h-44 rounded-md border-2 border-dashed transition-colors cursor-pointer overflow-hidden",
              "flex items-center justify-center",
              "bg-portal-surface dark:bg-dark-portal-surface",
              "border-portal-border dark:border-dark-portal-border",
              "hover:border-cyan-400 dark:hover:border-cyan-400",
            )}
          >
            {preview
              ? <>
                  <img src={preview} className="h-full w-full object-contain" alt="" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Change image</span>
                  </div>
                </>
              : <div className="flex flex-col items-center gap-2 text-neutral-400">
                  <ImageOutlined sx={{ fontSize: 36 }} />
                  <span className="text-xs">Click to upload image</span>
                </div>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          <Field label="Title" error={errors.title?.message}>
            <Input {...register('title', { required: 'Title is required' })} placeholder="Certificate title" />
          </Field>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end pt-1">
            <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
            <PrimaryButton loading={loading}>{item ? 'Save' : 'Add'}</PrimaryButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const CertificatesTab = () => {
  const [certs, setCerts] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [dialog, setDialog] = React.useState(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try { const { data } = await api.get(`${BASE}/certificates`); setCerts(data) }
    catch { } finally { setLoading(false) }
  }, [])

  React.useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    await api.delete(`${BASE}/certificates/${id}`)
    load()
  }

  return (
    <Fragment>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{certs.length} certificates</p>
        <button
          onClick={() => setDialog('add')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-medium transition-colors cursor-pointer"
        >
          <AddOutlined sx={{ fontSize: 16 }} />
          Add
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400 text-center py-12">Loading...</p>
      ) : certs.length === 0 ? (
        <p className="text-sm text-neutral-400 text-center py-12">No certificates yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {certs.map(cert => (
            <div
              key={cert.id}
              className={clsx("relative group rounded-xl overflow-hidden bg-portal-panel dark:bg-dark-portal-panel p-1.5", 
                "flex flex-col gap-1.5")}
            >
              <div className="aspect-video overflow-hidden">
                <img src={cert.image} className="w-full h-full object-cover rounded-lg" alt={cert.title} />
              </div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">{cert.title}</p>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setDialog(cert)}
                  className={clsx("size-8 rounded-lg bg-black/60 text-white hover:bg-black/80 cursor-pointer transition-colors",
                    "flex justify-center items-center"
                  )}
                >
                  <EditOutlined sx={{ fontSize: 16 }} />
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className={clsx("size-8 rounded-lg bg-red-500/80 text-white hover:bg-red-500 cursor-pointer transition-colors",
                    "flex justify-center items-center"
                  )}
                >
                  <DeleteOutlined sx={{ fontSize: 16 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {dialog !== null && (
        <CertificateDialog
          item={dialog === 'add' ? null : dialog}
          onClose={() => setDialog(null)}
          onSaved={() => { setDialog(null); load() }}
        />
      )}
    </Fragment>
  )
}

// ── Skills ────────────────────────────────────────────────────────────────────

const SkillDialog = ({ item, onClose, onSaved }) => {
  const [level, setLevel] = React.useState(item?.level ?? 50)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: item?.name || '' },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const payload = { name: data.name, level }
      if (item) await api.patch(`${BASE}/skills/${item.id}`, payload)
      else      await api.post(`${BASE}/skills`, payload)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving skill')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
          {item ? 'Edit skill' : 'Add skill'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field label="Name" error={errors.name?.message}>
            <Input {...register('name', { required: 'Name is required' })} placeholder="Skill name" />
          </Field>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Level</span>
              <span className="text-xs font-mono text-cyan-500">{level}%</span>
            </div>
            <Slider min={1} max={100} step={1} value={level} onChange={(_, v) => setLevel(v)} size="small" />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end pt-1">
            <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
            <PrimaryButton loading={loading}>{item ? 'Save' : 'Add'}</PrimaryButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const SkillsTab = () => {
  const [skills, setSkills] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [dialog, setDialog] = React.useState(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try { const { data } = await api.get(`${BASE}/skills`); setSkills(data) }
    catch { } finally { setLoading(false) }
  }, [])

  React.useEffect(() => { load() }, [load])

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{skills.length} skills</p>
        <button
          onClick={() => setDialog('add')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-medium transition-colors cursor-pointer"
        >
          <AddOutlined sx={{ fontSize: 16 }} />
          Add
        </button>
      </div>

      <Panel className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-portal-border dark:border-dark-portal-border text-left">
              <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Skill</th>
              <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Level</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-neutral-400">Loading...</td></tr>
            )}
            {!loading && skills.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-neutral-400">No skills yet</td></tr>
            )}
            {!loading && skills.map(skill => (
              <tr key={skill.id} className="border-b border-portal-border dark:border-dark-portal-border last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">{skill.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-portal-border dark:bg-dark-portal-border overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${skill.level}%` }} />
                    </div>
                    <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 w-8 text-right">{skill.level}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => setDialog(skill)}
                      className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-portal-border dark:hover:bg-dark-portal-border transition-colors cursor-pointer"
                    >
                      <EditOutlined sx={{ fontSize: 15 }} />
                    </button>
                    <button
                      onClick={async () => { await api.delete(`${BASE}/skills/${skill.id}`); load() }}
                      className="p-1.5 rounded text-neutral-400 hover:text-red-500 hover:bg-red-400/10 transition-colors cursor-pointer"
                    >
                      <DeleteOutlined sx={{ fontSize: 15 }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {dialog !== null && (
        <SkillDialog
          item={dialog === 'add' ? null : dialog}
          onClose={() => setDialog(null)}
          onSaved={() => { setDialog(null); load() }}
        />
      )}
    </>
  )
}

// ── Experience ────────────────────────────────────────────────────────────────

const ExperienceDialog = ({ item, types, onClose, onSaved }) => {
  const fileRef = React.useRef(null)
  const [iconPreview, setIconPreview] = React.useState(item?.icon || null)
  const [iconFile, setIconFile] = React.useState(null)
  const [removeIcon, setRemoveIcon] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      role:     item?.role     || '',
      company:  item?.company  || '',
      website:  item?.website  || '',
      location: item?.location || '',
      typeId:   item?.typeId   ?? types[0]?.id ?? '',
      startAt:  item?.startAt  || '',
      endsAt:   item?.endsAt   || '',
    },
  })

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setIconFile(f)
    setIconPreview(URL.createObjectURL(f))
    setRemoveIcon(false)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const form = new FormData()
      Object.entries(data).forEach(([k, v]) => form.append(k, v ?? ''))
      if (iconFile) form.append('icon', iconFile)
      if (removeIcon) form.append('removeIcon', 'true')
      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }
      if (item) await api.patch(`${BASE}/experience/${item.id}`, form, cfg)
      else      await api.post(`${BASE}/experience`, form, cfg)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving experience')
    } finally {
      setLoading(false)
    }
  }

  const currentIcon = removeIcon ? null : (iconPreview || item?.icon || null)
  const typeOptions = types.map(t => ({ value: t.id, label: t.title }))

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
          {item ? 'Edit experience' : 'Add experience'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Icon */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileRef.current?.click()}
              className="size-14 rounded-lg border border-portal-border dark:border-dark-portal-border flex items-center justify-center overflow-hidden cursor-pointer group bg-portal-surface dark:bg-dark-portal-surface shrink-0 relative"
            >
              {currentIcon
                ? <img src={currentIcon} className="size-full object-cover" alt="" />
                : <ImageOutlined sx={{ fontSize: 22 }} className="text-neutral-400" />
              }
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <EditOutlined sx={{ fontSize: 16, color: 'white' }} />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="flex flex-col gap-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Company icon <span className="text-neutral-400">(optional)</span></p>
              {(item?.icon || iconFile) && !removeIcon && (
                <button
                  type="button"
                  onClick={() => { setRemoveIcon(true); setIconFile(null); setIconPreview(null) }}
                  className="text-xs text-red-500 hover:text-red-400 cursor-pointer text-left transition-colors"
                >
                  Remove icon
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Role" error={errors.role?.message}>
              <Input {...register('role', { required: 'Required' })} placeholder="Job title" />
            </Field>
            <Field label="Company" error={errors.company?.message}>
              <Input {...register('company', { required: 'Required' })} placeholder="Company name" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Location" error={errors.location?.message}>
              <Input {...register('location', { required: 'Required' })} placeholder="City, Country" />
            </Field>
            <Field label="Website">
              <Input {...register('website')} placeholder="https://..." />
            </Field>
          </div>

          <Field label="Type">
            <Controller name="typeId" control={control} render={({ field }) => (
              <Select value={field.value} onChange={field.onChange} options={typeOptions} />
            )} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date" error={errors.startAt?.message}>
              <input {...register('startAt', { required: 'Required' })} type="date" className={dateInput} />
            </Field>
            <Field label="End date">
              <input {...register('endsAt')} type="date" className={dateInput} />
            </Field>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end pt-1">
            <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
            <PrimaryButton loading={loading}>{item ? 'Save' : 'Add'}</PrimaryButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const ExperienceTab = () => {
  const [experiences, setExperiences] = React.useState([])
  const [types, setTypes] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [dialog, setDialog] = React.useState(null)
  const [newTypeName, setNewTypeName] = React.useState('')
  const [addingType, setAddingType] = React.useState(false)
  const [typeError, setTypeError] = React.useState(null)

  const loadAll = React.useCallback(async () => {
    setLoading(true)
    try {
      const [expRes, typesRes] = await Promise.all([
        api.get(`${BASE}/experience`),
        api.get(`${BASE}/experience/types`),
      ])
      setExperiences(expRes.data)
      setTypes(typesRes.data)
    } catch { } finally { setLoading(false) }
  }, [])

  React.useEffect(() => { loadAll() }, [loadAll])

  const handleAddType = async () => {
    if (!newTypeName.trim()) return
    setAddingType(true)
    try {
      const { data } = await api.post(`${BASE}/experience/types`, { title: newTypeName.trim() })
      setTypes(prev => [...prev, data])
      setNewTypeName('')
    } catch { } finally { setAddingType(false) }
  }

  const handleDeleteType = async (id) => {
    setTypeError(null)
    try {
      await api.delete(`${BASE}/experience/types/${id}`)
      setTypes(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      setTypeError(err.response?.data?.message || 'Cannot delete type')
    }
  }

  return (
    <>
      {/* Types panel */}
      <Panel className="flex flex-col gap-3">
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Types</p>
        <div className="flex flex-wrap items-center gap-2">
          {types.map(t => (
            <Chip key={t.id} label={t.title} onDelete={() => handleDeleteType(t.id)} />
          ))}
          <div className="flex items-center gap-1">
            <input
              value={newTypeName}
              onChange={e => setNewTypeName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddType())}
              placeholder="New type..."
              className={clsx(
                "px-2.5 py-1 text-xs rounded-md border transition-colors",
                "bg-portal-surface dark:bg-dark-portal-surface",
                "border-portal-border dark:border-dark-portal-border",
                "text-neutral-900 dark:text-white placeholder:text-neutral-400",
                "focus:outline-none focus:border-cyan-400",
              )}
            />
            <button
              onClick={handleAddType}
              disabled={addingType}
              className="px-2.5 py-1 text-xs rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
        {typeError && <p className="text-xs text-red-500">{typeError}</p>}
      </Panel>

      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{experiences.length} entries</p>
        <button
          onClick={() => setDialog('add')}
          disabled={types.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <AddOutlined sx={{ fontSize: 16 }} />
          Add
        </button>
      </div>

      <Panel className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-portal-border dark:border-dark-portal-border text-left">
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Role / Company</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Type</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap">Period</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Location</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-400">Loading...</td></tr>
              )}
              {!loading && experiences.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-400">No experience entries yet</td></tr>
              )}
              {!loading && experiences.map(exp => (
                <tr key={exp.id} className="border-b border-portal-border dark:border-dark-portal-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="size-8 rounded overflow-hidden bg-portal-border dark:bg-dark-portal-border flex items-center justify-center text-xs text-neutral-500 font-bold shrink-0">
                      {exp.icon
                        ? <img src={exp.icon} className="size-full object-cover" alt="" />
                        : exp.company?.[0]?.toUpperCase()
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900 dark:text-white">{exp.role}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{exp.company}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs border border-portal-border dark:border-dark-portal-border bg-portal-panel dark:bg-dark-portal-panel text-neutral-600 dark:text-neutral-300">
                      {exp.type?.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                    {formatDate(exp.startAt)} — {formatDate(exp.endsAt)}
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400">{exp.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setDialog(exp)}
                        className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-portal-border dark:hover:bg-dark-portal-border transition-colors cursor-pointer"
                      >
                        <EditOutlined sx={{ fontSize: 15 }} />
                      </button>
                      <button
                        onClick={async () => { await api.delete(`${BASE}/experience/${exp.id}`); loadAll() }}
                        className="p-1.5 rounded text-neutral-400 hover:text-red-500 hover:bg-red-400/10 transition-colors cursor-pointer"
                      >
                        <DeleteOutlined sx={{ fontSize: 15 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {dialog !== null && (
        <ExperienceDialog
          item={dialog === 'add' ? null : dialog}
          types={types}
          onClose={() => setDialog(null)}
          onSaved={() => { setDialog(null); loadAll() }}
        />
      )}
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'certificates', label: 'Certificates' },
  { id: 'skills',       label: 'Skills' },
  { id: 'experience',   label: 'Experience' },
]

export const AdminPage = () => {
  const [tab, setTab] = React.useState('certificates')

  return (
    <div className="flex flex-col gap-5 overflow-auto h-full">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center rounded-full overflow-hidden p-1 bg-portal-panel dark:bg-dark-portal-panel">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                "px-4 py-1.5 text-sm transition-colors cursor-pointer rounded-full",
                tab === t.id
                  ? "bg-portal-surface dark:bg-dark-portal-surface text-cyan-600 dark:text-cyan-400"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-cyan-400",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'certificates' && <CertificatesTab />}
      {tab === 'skills'       && <SkillsTab />}
      {tab === 'experience'   && <ExperienceTab />}

    </div>
  )
}
