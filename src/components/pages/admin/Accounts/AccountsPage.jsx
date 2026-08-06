import React from 'react'
import clsx from 'clsx'
import { useForm, Controller } from 'react-hook-form'
import { CameraAltOutlined, SearchOutlined, EditOutlined, ZoomInOutlined, ZoomOutOutlined, BadgeOutlined, AccountCircleOutlined, MailOutlined } from '@mui/icons-material'
import { Dialog, DialogContent, DialogActions, Slider } from '@mui/material'
import Cropper from 'react-easy-crop'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel, SuccessMessage } from '../../../ui'
import { Button } from '../../../material/Button'
import { Input } from '../../../material/Input'
import { Select } from '../../../material/Select'

// ── Crop helpers ──────────────────────────────────────────────────────────────

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', reject)
    img.setAttribute('crossOrigin', 'anonymous')
    img.src = url
  })

const getCroppedBlob = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92))
}

// ── Crop dialog ───────────────────────────────────────────────────────────────

const CropDialog = ({ src, onConfirm, onCancel }) => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null)

  return (
    <Dialog open onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: 0, position: 'relative', height: 320, bgcolor: '#000' }}>
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
        />
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', gap: 1, px: 3, pb: 2 }}>
        <div className="flex items-center gap-2 w-full">
          <ZoomOutOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Slider min={1} max={3} step={0.05} value={zoom} onChange={(_, v) => setZoom(v)} size="small" />
          <ZoomInOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
        </div>
        <div className="flex gap-2 w-full justify-end">
          <Button.User type="button" color="secondary" onClick={onCancel}>
            Cancel
          </Button.User>
          <Button.User
            type="button"
            variant="normal"
            onClick={async () => onConfirm(await getCroppedBlob(src, croppedAreaPixels))}
          >
            Apply
          </Button.User>
        </div>
      </DialogActions>
    </Dialog>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const getInitials = (username) => {
  if (!username) return '??'
  const parts = username.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return username.slice(0, 2).toUpperCase()
}

const AUTHORITY_LABEL = { [-1]: 'Banned', 0: 'User', 100: 'Admin' }
const AUTHORITY_CLS   = {
  [-1]: 'bg-red-400/10 text-red-600 dark:text-red-400',
  0:    'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300',
  100:  'bg-cyan-400/10 text-cyan-600 dark:text-cyan-400',
}

// ── Edit modal ────────────────────────────────────────────────────────────────

const EditModal = ({ account, onClose, onSaved }) => {
  const fileRef = React.useRef(null)
  const [cropSrc, setCropSrc] = React.useState(null)
  const [avatarFile, setAvatarFile] = React.useState(null)
  const [avatarPreview, setAvatarPreview] = React.useState(null)
  const [removeAvatar, setRemoveAvatar] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState(null)

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      username:  account.username  || '',
      email:     account.email     || '',
      name:      account.name      || '',
      authority: account.authority ?? 0,
      lang:      account.lang      || 'es',
    },
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError('Image must be smaller than 2MB'); return }
    setCropSrc(URL.createObjectURL(file))
    setError(null)
  }

  const handleCropConfirm = (blob) => {
    setAvatarFile(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }))
    setAvatarPreview(URL.createObjectURL(blob))
    setRemoveAvatar(false)
    setCropSrc(null)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      if (avatarFile) {
        const form = new FormData()
        form.append('avatar', avatarFile)
        await api.post(`${API_ROUTES.ADMIN}/accounts/${account.id}/avatar`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else if (removeAvatar) {
        await api.delete(`${API_ROUTES.ADMIN}/accounts/${account.id}/avatar`)
      }

      await api.patch(`${API_ROUTES.ADMIN}/accounts/${account.id}`, {
        username:  data.username,
        email:     data.email,
        name:      data.name,
        authority: data.authority,
        lang:      data.lang,
      })

      setSuccess(true)
      setAvatarFile(null)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating account')
    } finally {
      setLoading(false)
    }
  }

  const currentAvatar = removeAvatar ? null : (avatarPreview || account.avatar)

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      {cropSrc && (
        <CropDialog
          src={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}
      <DialogContent sx={{ p: 3 }}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">Edit account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileRef.current?.click()}
              className="relative size-16 rounded-full flex items-center justify-center overflow-hidden cursor-pointer group shrink-0 bg-portal-border dark:bg-dark-portal-border"
            >
              {currentAvatar
                ? <img src={currentAvatar} className="size-full object-cover" alt="avatar" />
                : <span className="text-lg font-bold font-mono text-neutral-600 dark:text-neutral-300">{getInitials(account.username)}</span>
              }
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <CameraAltOutlined sx={{ fontSize: 20, color: 'white' }} />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Profile photo</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">JPG, PNG, GIF or WebP · Max 2MB</p>
              {(account.avatar || avatarFile) && !removeAvatar && (
                <button
                  type="button"
                  onClick={() => { setRemoveAvatar(true); setAvatarFile(null); setAvatarPreview(null) }}
                  className="text-xs text-red-500 hover:text-red-400 text-left cursor-pointer transition-colors w-fit"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input.User label="Display name" icon={<BadgeOutlined sx={{ fontSize: 18 }} />} error={errors.name?.message} {...register('name')} placeholder="Full name" />
            <Input.User label="Username" icon={<AccountCircleOutlined sx={{ fontSize: 18 }} />} error={errors.username?.message} {...register('username', { required: 'Required', minLength: { value: 3, message: 'Min 3 chars' } })} />
          </div>

          <Input.User label="Email" icon={<MailOutlined sx={{ fontSize: 18 }} />} error={errors.email?.message} {...register('email', { required: 'Required' })} type="email" />

          <div className="grid grid-cols-2 gap-3">
            <Controller name="authority" control={control} render={({ field }) => (
              <Select.User
                label="Authority"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: -1,  label: 'Banned' },
                  { value: 0,   label: 'User' },
                  { value: 100, label: 'Admin' },
                ]}
              />
            )} />
            <Controller name="lang" control={control} render={({ field }) => (
              <Select.User
                label="Language"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: 'es', label: 'Spanish' },
                  { value: 'en', label: 'English' },
                ]}
              />
            )} />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <SuccessMessage message="Account updated" />}

          <div className="flex gap-2 justify-end pt-1">
            <Button.User type="button" color="secondary" onClick={onClose}>Cancel</Button.User>
            <Button.User variant="normal" loading={loading}>Save changes</Button.User>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export const AccountsPage = () => {
  const [accounts, setAccounts] = React.useState([])
  const [total, setTotal] = React.useState(0)
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [selected, setSelected] = React.useState(null)

  const LIMIT = 20

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`${API_ROUTES.ADMIN}/accounts`, {
        params: { search, page, limit: LIMIT },
      })
      setAccounts(data.accounts)
      setTotal(data.total)
    } catch {
      // silence
    } finally {
      setLoading(false)
    }
  }, [search, page])

  React.useEffect(() => { load() }, [load])

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="flex flex-col gap-5 overflow-auto h-full">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Accounts</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{total} registered</p>
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <Input.User
          icon={<SearchOutlined sx={{ fontSize: 18 }} />}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search by username, email or name..."
        />
      </div>

      {/* Table */}
      <Panel className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-portal-border dark:border-dark-portal-border text-left">
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400 w-10"></th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">User</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Email</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Authority</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Lang</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Joined</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-400 text-sm">Loading...</td>
                </tr>
              )}
              {!loading && accounts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-400 text-sm">No accounts found</td>
                </tr>
              )}
              {!loading && accounts.map(account => (
                <tr
                  key={account.id}
                  className="border-b border-portal-border dark:border-dark-portal-border last:border-0 hover:bg-portal-panel/50 dark:hover:bg-dark-portal-panel/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="size-8 rounded-full overflow-hidden flex items-center justify-center bg-portal-border dark:bg-dark-portal-border text-xs font-bold font-mono text-neutral-600 dark:text-neutral-300 shrink-0">
                      {account.avatar
                        ? <img src={account.avatar} className="size-full object-cover" alt="" />
                        : getInitials(account.username)
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900 dark:text-white">{account.username}</p>
                    {account.name && <p className="text-xs text-neutral-500 dark:text-neutral-400">{account.name}</p>}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">{account.email}</td>
                  <td className="px-4 py-3">
                    <span className={clsx(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      AUTHORITY_CLS[account.authority] || AUTHORITY_CLS[0],
                    )}>
                      {AUTHORITY_LABEL[account.authority] || `Level ${account.authority}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300 uppercase text-xs">{account.lang}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 text-xs whitespace-nowrap">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(account)}
                      className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-portal-border dark:hover:bg-dark-portal-border transition-colors cursor-pointer"
                    >
                      <EditOutlined sx={{ fontSize: 16 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 justify-end text-sm">
          <Button.User size="sm" color="secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Prev
          </Button.User>
          <span className="text-neutral-500 dark:text-neutral-400">
            {page} / {totalPages}
          </span>
          <Button.User size="sm" color="secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            Next
          </Button.User>
        </div>
      )}

      {/* Edit modal */}
      {selected && (
        <EditModal
          account={selected}
          onClose={() => setSelected(null)}
          onSaved={() => { load(); setSelected(null) }}
        />
      )}
    </div>
  )
}
