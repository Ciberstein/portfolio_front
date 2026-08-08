import React from 'react'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { AddOutlined, EditOutlined, DeleteOutlined, ImageOutlined, WorkspacePremiumOutlined } from '@mui/icons-material'
import { Dialog, DialogContent } from '@mui/material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Button } from '../../../material/Button'
import { Input } from '../../../material/Input'

const BASE = `${API_ROUTES.ADMIN}/portfolio`

// ── Dialog ────────────────────────────────────────────────────────────────────

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

          <Input.User label="Title" icon={<WorkspacePremiumOutlined sx={{ fontSize: 18 }} />} error={errors.title?.message} {...register('title', { required: 'Title is required' })} placeholder="Certificate title" />

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

// ── Page ──────────────────────────────────────────────────────────────────────

export const CertificatesPage = () => {
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
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{certs.length} certificates</p>
        <Button.User variant="normal" className="gap-1.5" onClick={() => setDialog('add')}>
          <AddOutlined sx={{ fontSize: 16 }} />
          Add
        </Button.User>
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
                <Button.Icon variant="overlay" color="neutral"
                  onClick={() => setDialog(cert)}
                  >
                  <EditOutlined sx={{ fontSize: 16 }} />
                  </Button.Icon>
                <Button.Icon variant="overlay" color="danger"
                  onClick={() => handleDelete(cert.id)}
                  >
                  <DeleteOutlined sx={{ fontSize: 16 }} />
                  </Button.Icon>
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
    </>
  )
}
