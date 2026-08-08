import React from 'react'
import clsx from 'clsx'
import { AddOutlined, DeleteOutlined, EditOutlined, TitleOutlined, DescriptionOutlined } from '@mui/icons-material'
import { Dialog, DialogContent } from '@mui/material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel } from '../../../ui'
import { Button } from '../../../material/Button'
import { Input } from '../../../material/Input'
import { SERVICE_ICONS, SERVICE_ICON_NAMES, getServiceIcon } from '../../../../utils/serviceIcons'

const BASE = `${API_ROUTES.ADMIN}/settings/services`

// ── Icon picker ───────────────────────────────────────────────────────────────

const IconPicker = ({ value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Icon</label>
    <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
      {SERVICE_ICON_NAMES.map(name => {
        const Icon = SERVICE_ICONS[name]
        const active = value === name
        return (
          <button
            key={name}
            type="button"
            title={name}
            onClick={() => onChange(name)}
            className={clsx(
              'aspect-square rounded-lg border-2 flex items-center justify-center transition-colors cursor-pointer',
              active
                ? 'border-cyan-500 bg-cyan-400/10 text-cyan-600 dark:text-cyan-400'
                : 'border-portal-border dark:border-dark-portal-border text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
            )}
          >
            <Icon sx={{ fontSize: 20 }} />
          </button>
        )
      })}
    </div>
  </div>
)

// ── Dialog ────────────────────────────────────────────────────────────────────

const ServiceDialog = ({ item, count, onClose, onSaved }) => {
  const [title, setTitle] = React.useState(item?.title || '')
  const [description, setDescription] = React.useState(item?.description || '')
  const [icon, setIcon] = React.useState(item?.icon || 'Code')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const save = async () => {
    if (!title.trim())       { setError('Title is required'); return }
    if (!description.trim()) { setError('Description is required'); return }
    setLoading(true)
    setError(null)
    try {
      const payload = { title: title.trim(), description: description.trim(), icon, order: item?.order ?? count }
      if (item) await api.patch(`${BASE}/${item.id}`, payload)
      else      await api.post(BASE, payload)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save')
    } finally { setLoading(false) }
  }

  const Preview = getServiceIcon(icon)

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
          {item ? 'Edit service' : 'Add service'}
        </h2>
        <div className="flex flex-col gap-3">
          <Input.User
            label="Title"
            icon={<TitleOutlined sx={{ fontSize: 18 }} />}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Web development"
          />
          <Input.User
            as="textarea"
            label="Description"
            icon={<DescriptionOutlined sx={{ fontSize: 18 }} />}
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What you offer and what it covers..."
          />

          <IconPicker value={icon} onChange={setIcon} />

          {/* Same component the landing will draw, so what you pick is what ships */}
          <div className="flex items-center gap-3 rounded-lg border border-portal-border dark:border-dark-portal-border p-3">
            <Preview sx={{ fontSize: 40 }} className="text-cyan-500 shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-neutral-900 dark:text-white truncate">{title || 'Title'}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                {description || 'Description'}
              </p>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end">
            <Button.User type="button" variant="outline" color="secondary" onClick={onClose}>Cancel</Button.User>
            <Button.User type="button" variant="normal" loading={loading} onClick={save}>
              {item ? 'Save' : 'Add'}
            </Button.User>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const ServicesPage = () => {
  const [services, setServices] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [dialog, setDialog] = React.useState(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try { const { data } = await api.get(BASE); setServices(data) }
    catch { } finally { setLoading(false) }
  }, [])

  React.useEffect(() => { load() }, [load])

  const remove = async (id) => {
    await api.delete(`${BASE}/${id}`)
    load()
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{services.length} services</p>
        <Button.User variant="normal" className="gap-1.5" onClick={() => setDialog('add')}>
          <AddOutlined sx={{ fontSize: 16 }} />
          Add
        </Button.User>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-400 text-center py-12">Loading...</p>
      ) : services.length === 0 ? (
        <Panel className="items-center text-center py-12 gap-2">
          <p className="font-medium text-neutral-900 dark:text-white">No services yet</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            These appear in the Services tab of your landing page.
          </p>
        </Panel>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {services.map(service => {
            const Icon = getServiceIcon(service.icon)
            return (
              <Panel key={service.id} className="gap-2">
                <div className="flex items-start justify-between gap-2">
                  <Icon sx={{ fontSize: 32 }} className="text-cyan-500 shrink-0" />
                  <div className="flex gap-1">
                    <Button.Icon onClick={() => setDialog(service)}>
                      <EditOutlined sx={{ fontSize: 15 }} />
                    </Button.Icon>
                    <Button.Icon color="danger" size="md"
                      onClick={() => remove(service.id)}
                      >
                      <DeleteOutlined sx={{ fontSize: 15 }} />
                    </Button.Icon>
                  </div>
                </div>
                <p className="font-medium text-neutral-900 dark:text-white">{service.title}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{service.description}</p>
              </Panel>
            )
          })}
        </div>
      )}

      {dialog !== null && (
        <ServiceDialog
          item={dialog === 'add' ? null : dialog}
          count={services.length}
          onClose={() => setDialog(null)}
          onSaved={() => { setDialog(null); load() }}
        />
      )}
    </>
  )
}
