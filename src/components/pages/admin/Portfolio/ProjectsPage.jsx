import React from 'react'
import clsx from 'clsx'
import { useForm, Controller } from 'react-hook-form'
import {
  AddOutlined, EditOutlined, DeleteOutlined, ImageOutlined,
  TitleOutlined, DescriptionOutlined, CategoryOutlined, LayersOutlined,
  GitHub, LaunchOutlined, CalendarTodayOutlined,
  StarOutlined, StarBorderOutlined,
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

// ── Stack editor ──────────────────────────────────────────────────────────────
// Free-form tags. Kept as a controlled array so the dialog can ship it as JSON.

const StackField = ({ value = [], onChange }) => {
  const [draft, setDraft] = React.useState('')

  const add = () => {
    const tag = draft.trim()
    if (!tag) return
    if (!value.some(v => v.toLowerCase() === tag.toLowerCase())) onChange([...value, tag])
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
        Stack <span className="font-normal text-neutral-400">— press Enter to add</span>
      </label>
      <Input.User
        icon={<LayersOutlined sx={{ fontSize: 18 }} />}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
        placeholder="React, Node, PostgreSQL..."
        element={
          <button
            type="button"
            onClick={add}
            title="Add technology"
            className="shrink-0 flex items-center text-neutral-400 hover:text-cyan-500 transition-colors cursor-pointer"
          >
            <AddOutlined sx={{ fontSize: 16 }} />
          </button>
        }
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              onDelete={() => onChange(value.filter(v => v !== tag))}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Dialog ────────────────────────────────────────────────────────────────────

const ProjectDialog = ({ item, types, onClose, onSaved }) => {
  const fileRef = React.useRef(null)
  const [preview, setPreview] = React.useState(item?.image || null)
  const [file, setFile] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      title:       item?.title       || '',
      description: item?.description || '',
      repoUrl:     item?.repoUrl     || '',
      liveUrl:     item?.liveUrl     || '',
      stack:       item?.stack       || [],
      featured:    item?.featured    ?? false,
      finishedAt:  item?.finishedAt  || '',
      typeId:      item?.typeId      ?? types[0]?.id ?? '',
    },
  })

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const onSubmit = async (data) => {
    if (!item && !file) { setError('Cover image is required'); return }
    setLoading(true)
    setError(null)
    try {
      const form = new FormData()
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'stack') form.append(k, JSON.stringify(v ?? []))
        else form.append(k, v ?? '')
      })
      if (file) form.append('image', file)

      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }
      if (item) await api.patch(`${BASE}/projects/${item.id}`, form, cfg)
      else      await api.post(`${BASE}/projects`, form, cfg)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving project')
    } finally {
      setLoading(false)
    }
  }

  const typeOptions = types.map(t => ({ value: t.id, label: t.title }))

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
          {item ? 'Edit project' : 'Add project'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Cover */}
          <div
            onClick={() => fileRef.current?.click()}
            className={clsx(
              "relative h-40 rounded-md border-2 border-dashed transition-colors cursor-pointer overflow-hidden",
              "flex items-center justify-center",
              "bg-portal-surface dark:bg-dark-portal-surface",
              "border-portal-border dark:border-dark-portal-border",
              "hover:border-cyan-400 dark:hover:border-cyan-400",
            )}
          >
            {preview
              ? <>
                  <img src={preview} className="h-full w-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Change cover</span>
                  </div>
                </>
              : <div className="flex flex-col items-center gap-2 text-neutral-400">
                  <ImageOutlined sx={{ fontSize: 32 }} />
                  <span className="text-xs">Click to upload cover</span>
                </div>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          <Input.User
            label="Title"
            icon={<TitleOutlined sx={{ fontSize: 18 }} />}
            error={errors.title?.message}
            {...register('title', { required: 'Required' })}
            placeholder="Project name"
          />

          <Input.User
            as="textarea"
            label="Description"
            icon={<DescriptionOutlined sx={{ fontSize: 18 }} />}
            error={errors.description?.message}
            {...register('description', { required: 'Required' })}
            rows={4}
            placeholder="What it does, what problem it solves..."
          />

          <div className="grid grid-cols-2 gap-3">
            <Controller name="typeId" control={control} render={({ field }) => (
              <Select.User
                label="Type"
                icon={<CategoryOutlined sx={{ fontSize: 18 }} />}
                value={field.value}
                onChange={field.onChange}
                options={typeOptions}
              />
            )} />
            <Input.User
              label={<>Finished <span className="font-normal text-neutral-400">(optional)</span></>}
              icon={<CalendarTodayOutlined sx={{ fontSize: 18 }} />}
              {...register('finishedAt')}
              type="date"
              className={dateScheme}
            />
          </div>

          <Controller name="stack" control={control} render={({ field }) => (
            <StackField value={field.value} onChange={field.onChange} />
          )} />

          <div className="grid grid-cols-2 gap-3">
            <Input.User
              label={<>Repository <span className="font-normal text-neutral-400">(optional)</span></>}
              icon={<GitHub sx={{ fontSize: 18 }} />}
              {...register('repoUrl')}
              placeholder="https://github.com/..."
            />
            <Input.User
              label={<>Live demo <span className="font-normal text-neutral-400">(optional)</span></>}
              icon={<LaunchOutlined sx={{ fontSize: 18 }} />}
              {...register('liveUrl')}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 gap-3 items-end">
            <Controller name="featured" control={control} render={({ field }) => (
              <Button.User
                type="button"
                variant={field.value ? 'normal' : 'outline'}
                color={field.value ? 'warning' : 'secondary'}
                className="gap-1.5"
                onClick={() => field.onChange(!field.value)}
              >
                {field.value
                  ? <StarOutlined sx={{ fontSize: 16 }} />
                  : <StarBorderOutlined sx={{ fontSize: 16 }} />}
                {field.value ? 'Featured' : 'Not featured'}
              </Button.User>
            )} />
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
      const { data } = await api.post(`${BASE}/projects/types`, { title: newTypeName.trim() })
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
      await api.delete(`${BASE}/projects/types/${id}`)
      onDeleted(id)
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot delete type')
    }
  }

  return (
    <Panel className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold text-neutral-900 dark:text-white">Types</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Categories available when creating a project — web app, software, mobile...
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

export const ProjectsPage = () => {
  const [projects, setProjects] = React.useState([])
  const [types, setTypes] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [dialog, setDialog] = React.useState(null)

  const loadAll = React.useCallback(async () => {
    setLoading(true)
    try {
      const [projRes, typesRes] = await Promise.all([
        api.get(`${BASE}/projects`),
        api.get(`${BASE}/projects/types`),
      ])
      setProjects(projRes.data)
      setTypes(typesRes.data)
    } catch { } finally { setLoading(false) }
  }, [])

  React.useEffect(() => { loadAll() }, [loadAll])

  const handleDelete = async (id) => {
    await api.delete(`${BASE}/projects/${id}`)
    loadAll()
  }

  return (
    <>
      <TypesPanel
        types={types}
        onAdded={t => setTypes(prev => [...prev, t])}
        onDeleted={id => setTypes(prev => prev.filter(t => t.id !== id))}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{projects.length} projects</p>
        <Button.User variant="normal" className="gap-1.5" disabled={types.length === 0} onClick={() => setDialog('add')}>
          <AddOutlined sx={{ fontSize: 16 }} />
          Add
        </Button.User>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400 text-center py-12">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-neutral-400 text-center py-12">
          {types.length === 0 ? 'Create a type first, then add your projects' : 'No projects yet'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              className="relative group rounded-xl overflow-hidden bg-portal-panel dark:bg-dark-portal-panel p-1.5 flex flex-col gap-2"
            >
              <div className="aspect-video overflow-hidden rounded-lg">
                <img src={project.image} className="w-full h-full object-cover" alt={project.title} />
              </div>

              <div className="flex flex-col gap-1.5 px-1 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {project.title}
                  </p>
                  {project.featured && (
                    <StarOutlined sx={{ fontSize: 15 }} className="text-amber-400 shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="px-2 py-0.5 rounded border border-portal-border dark:border-dark-portal-border">
                    {project.type?.title}
                  </span>
                  {project.repoUrl && <GitHub sx={{ fontSize: 14 }} />}
                  {project.liveUrl && <LaunchOutlined sx={{ fontSize: 14 }} />}
                </div>

                {project.stack?.length > 0 && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {project.stack.join(' · ')}
                  </p>
                )}
              </div>

              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button.Icon variant="overlay" color="neutral" onClick={() => setDialog(project)}>
                  <EditOutlined sx={{ fontSize: 16 }} />
                </Button.Icon>
                <Button.Icon variant="overlay" color="danger" onClick={() => handleDelete(project.id)}>
                  <DeleteOutlined sx={{ fontSize: 16 }} />
                </Button.Icon>
              </div>
            </div>
          ))}
        </div>
      )}

      {dialog !== null && (
        <ProjectDialog
          item={dialog === 'add' ? null : dialog}
          types={types}
          onClose={() => setDialog(null)}
          onSaved={() => { setDialog(null); loadAll() }}
        />
      )}
    </>
  )
}
