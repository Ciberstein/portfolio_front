import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  AddOutlined, EditOutlined, DeleteOutlined, ImageOutlined,
  WorkOutlined, BusinessOutlined, LocationOnOutlined, LanguageOutlined,
  CategoryOutlined, CalendarTodayOutlined,
} from '@mui/icons-material'
import { Chip, Dialog, DialogContent } from '@mui/material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel } from '../../../ui'
import { Button } from '../../../material/Button'
import { Input } from '../../../material/Input'
import { Select } from '../../../material/Select'

const BASE = `${API_ROUTES.ADMIN}/portfolio`

// color-scheme is inherited, so setting it on the field wrapper reaches the native date picker
const dateScheme = "[color-scheme:light] dark:[color-scheme:dark]"

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'

// ── Dialog ────────────────────────────────────────────────────────────────────

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
            <Input.User label="Role" icon={<WorkOutlined sx={{ fontSize: 18 }} />} error={errors.role?.message} {...register('role', { required: 'Required' })} placeholder="Job title" />
            <Input.User label="Company" icon={<BusinessOutlined sx={{ fontSize: 18 }} />} error={errors.company?.message} {...register('company', { required: 'Required' })} placeholder="Company name" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input.User label="Location" icon={<LocationOnOutlined sx={{ fontSize: 18 }} />} error={errors.location?.message} {...register('location', { required: 'Required' })} placeholder="City, Country" />
            <Input.User label="Website" icon={<LanguageOutlined sx={{ fontSize: 18 }} />} {...register('website')} placeholder="https://..." />
          </div>

          <Controller name="typeId" control={control} render={({ field }) => (
            <Select.User label="Type" icon={<CategoryOutlined sx={{ fontSize: 18 }} />} value={field.value} onChange={field.onChange} options={typeOptions} />
          )} />

          <div className="grid grid-cols-2 gap-3">
            <Input.User label="Start date" icon={<CalendarTodayOutlined sx={{ fontSize: 18 }} />} error={errors.startAt?.message} {...register('startAt', { required: 'Required' })} type="date" className={dateScheme} />
            <Input.User
              label={<>End date <span className="font-normal text-neutral-400">(optional)</span></>}
              icon={<CalendarTodayOutlined sx={{ fontSize: 18 }} />}
              {...register('endsAt')}
              type="date"
              className={dateScheme}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end pt-1">
            <Button.User type="button" color="secondary" onClick={onClose}>Cancel</Button.User>
            <Button.User variant="normal" loading={loading}>{item ? 'Save' : 'Add'}</Button.User>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Types manager ─────────────────────────────────────────────────────────────

const TypesPanel = ({ types, onAdded, onDeleted }) => {
  const [newTypeName, setNewTypeName] = React.useState('')
  const [adding, setAdding] = React.useState(false)
  const [error, setError] = React.useState(null)

  const handleAdd = async () => {
    if (!newTypeName.trim()) return
    setAdding(true)
    setError(null)
    try {
      const { data } = await api.post(`${BASE}/experience/types`, { title: newTypeName.trim() })
      setNewTypeName('')
      onAdded(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot create type')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id) => {
    setError(null)
    try {
      await api.delete(`${BASE}/experience/types/${id}`)
      onDeleted(id)
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot delete type')
    }
  }

  return (
    <Panel className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold text-neutral-900 dark:text-white">Types</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Categories available when creating an experience entry
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {types.map(t => (
          <Chip key={t.id} label={t.title} onDelete={() => handleDelete(t.id)} />
        ))}
        <Input.User
          icon={<CategoryOutlined sx={{ fontSize: 16 }} />}
          value={newTypeName}
          onChange={e => setNewTypeName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder="New type..."
          element={
            <button
              type="button"
              disabled={adding}
              onClick={handleAdd}
              title="Add type"
              className="shrink-0 flex items-center text-neutral-400 hover:text-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <AddOutlined sx={{ fontSize: 16 }} />
            </button>
          }
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </Panel>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const ExperiencePage = () => {
  const [experiences, setExperiences] = React.useState([])
  const [types, setTypes] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [dialog, setDialog] = React.useState(null)

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

  return (
    <>
      <TypesPanel
        types={types}
        onAdded={t => setTypes(prev => [...prev, t])}
        onDeleted={id => setTypes(prev => prev.filter(t => t.id !== id))}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{experiences.length} entries</p>
        <Button.User variant="normal" className="gap-1.5" disabled={types.length === 0} onClick={() => setDialog('add')}>
          <AddOutlined sx={{ fontSize: 16 }} />
          Add
        </Button.User>
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
