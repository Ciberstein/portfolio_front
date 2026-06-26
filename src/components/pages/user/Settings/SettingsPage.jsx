import React from 'react'
import clsx from 'clsx'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { CameraAltOutlined, ZoomInOutlined, ZoomOutOutlined } from '@mui/icons-material'
import { Dialog, DialogContent, DialogActions, Slider } from '@mui/material'
import Cropper from 'react-easy-crop'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { accountThunk } from '../../../../store/slices/account.slice'
import { Panel, Field, Input, PrimaryButton, SecondaryButton, SuccessMessage } from '../../../ui'

// ── crop helpers ──────────────────────────────────────────────────────────────

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
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height,
  )
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92))
}

// ── crop dialog ───────────────────────────────────────────────────────────────

const CropDialog = ({ src, onConfirm, onCancel }) => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null)

  const handleConfirm = async () => {
    const blob = await getCroppedBlob(src, croppedAreaPixels)
    onConfirm(blob)
  }

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
          <Slider
            min={1} max={3} step={0.05}
            value={zoom}
            onChange={(_, v) => setZoom(v)}
            size="small"
          />
          <ZoomInOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
        </div>
        <div className="flex gap-2 w-full justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-sm rounded-md border border-portal-border dark:border-dark-portal-border hover:bg-portal-panel dark:hover:bg-dark-portal-panel transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-1.5 text-sm rounded-md bg-cyan-500 hover:bg-cyan-400 text-black font-medium transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────

const getInitials = (username) => {
  if (!username) return '??'
  const parts = username.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return username.slice(0, 2).toUpperCase()
}

// ── Profile section ───────────────────────────────────────────────────────────

const ProfileSection = () => {
  const account = useSelector(state => state.account)
  const dispatch = useDispatch()
  const fileRef = React.useRef(null)
  const [file, setFile] = React.useState(null)
  const [preview, setPreview] = React.useState(null)
  const [cropSrc, setCropSrc] = React.useState(null)
  const [removeAvatar, setRemoveAvatar] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: '', username: '' },
  })

  React.useEffect(() => {
    if (account) reset({ name: account.name || '', username: account.username || '' })
  }, [account])

  const handleAvatarChange = (e) => {
    const selected = e.target.files[0]
    e.target.value = ''
    if (!selected) return
    if (selected.size > 2 * 1024 * 1024) { setError('Image must be smaller than 2MB'); return }
    setCropSrc(URL.createObjectURL(selected))
    setError(null)
  }

  const handleCropConfirm = (blob) => {
    setFile(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }))
    setPreview(URL.createObjectURL(blob))
    setRemoveAvatar(false)
    setCropSrc(null)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      if (file) {
        const form = new FormData()
        form.append('avatar', file)
        await api.post(`${API_ROUTES.USER}/account/avatar`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else if (removeAvatar) {
        await api.delete(`${API_ROUTES.USER}/account/avatar`)
      }

      const profilePayload = {}
      if (data.name !== (account?.name || '')) profilePayload.name = data.name
      if (data.username !== account?.username) profilePayload.username = data.username
      if (Object.keys(profilePayload).length) {
        await api.patch(`${API_ROUTES.USER}/account/profile`, profilePayload)
      }

      dispatch(accountThunk())
      setSuccess(true)
      setFile(null)
      setPreview(null)
      setRemoveAvatar(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const currentAvatar = removeAvatar ? null : (preview || account?.avatar)

  return (
    <Panel title="Profile" description="Your public profile information">
      {cropSrc && (
        <CropDialog
          src={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="relative size-16 rounded-full flex items-center justify-center overflow-hidden cursor-pointer group shrink-0 bg-portal-border dark:bg-dark-portal-border"
          >
            {currentAvatar
              ? <img src={currentAvatar} className="size-full object-cover" alt="avatar" />
              : <span className="text-lg font-bold font-mono text-neutral-600 dark:text-neutral-300">
                  {getInitials(account?.username)}
                </span>
            }
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <CameraAltOutlined sx={{ fontSize: 20, color: 'white' }} />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">Profile photo</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">JPG, PNG, GIF or WebP · Max 2MB</p>
            {(account?.avatar || file) && !removeAvatar && (
              <button
                type="button"
                onClick={() => { setRemoveAvatar(true); setFile(null); setPreview(null) }}
                className="text-xs text-red-500 hover:text-red-400 text-left cursor-pointer transition-colors w-fit"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>

        <Field label="Display name" error={errors.name?.message}>
          <Input
            {...register('name')}
            placeholder="Your full name"
          />
        </Field>

        <Field label="Username" error={errors.username?.message}>
          <Input
            {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'At least 3 characters' } })}
          />
        </Field>

        <div className="flex items-center gap-3">
          <PrimaryButton loading={loading}>Save changes</PrimaryButton>
          {success && <SuccessMessage message="Profile updated" />}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </form>
    </Panel>
  )
}

// ── Email section ─────────────────────────────────────────────────────────────

const EmailSection = () => {
  const account = useSelector(state => state.account)
  const dispatch = useDispatch()
  const [step, setStep] = React.useState(1)
  const [newEmail, setNewEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [success, setSuccess] = React.useState(false)

  const form1 = useForm()
  const form2 = useForm()

  const sendCode = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await api.patch(`${API_ROUTES.AUTH}/update/email`, {
        email_new: data.email_new,
        email_new_repeat: data.email_new_repeat,
      })
      setNewEmail(data.email_new)
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending code')
    } finally {
      setLoading(false)
    }
  }

  const verify = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await api.patch(`${API_ROUTES.AUTH}/update/email/validation`, {
        email: newEmail,
        code: data.code,
      })
      dispatch(accountThunk())
      setSuccess(true)
      setStep(1)
      form1.reset()
      form2.reset()
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  const cancel = () => {
    setStep(1)
    setError(null)
    form1.reset()
    form2.reset()
  }

  return (
    <Panel title="Email address" description="A verification code will be sent to the new address">
      {step === 1 && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Current email</p>
            <p className="font-medium text-neutral-900 dark:text-white">{account?.email}</p>
            {success && <SuccessMessage message="Email updated successfully" />}
          </div>
          <SecondaryButton onClick={() => { setSuccess(false); setStep(2) }}>Change</SecondaryButton>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={form1.handleSubmit(sendCode)} className="flex flex-col gap-4">
          <Field label="New email" error={form1.formState.errors.email_new?.message}>
            <Input
              {...form1.register('email_new', { required: 'Email is required' })}
              type="email"
              placeholder="new@email.com"
            />
          </Field>
          <Field label="Confirm new email" error={form1.formState.errors.email_new_repeat?.message}>
            <Input
              {...form1.register('email_new_repeat', { required: 'Confirm your email' })}
              type="email"
              placeholder="new@email.com"
            />
          </Field>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <PrimaryButton loading={loading}>Send code</PrimaryButton>
            <SecondaryButton type="button" onClick={cancel}>Cancel</SecondaryButton>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={form2.handleSubmit(verify)} className="flex flex-col gap-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Enter the code sent to <span className="font-medium text-neutral-900 dark:text-white">{newEmail}</span>
          </p>
          <Field label="Verification code" error={form2.formState.errors.code?.message}>
            <Input
              {...form2.register('code', { required: 'Code is required' })}
              placeholder="000000"
            />
          </Field>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <PrimaryButton loading={loading}>Verify</PrimaryButton>
            <SecondaryButton type="button" onClick={cancel}>Cancel</SecondaryButton>
          </div>
        </form>
      )}
    </Panel>
  )
}

// ── Password section ──────────────────────────────────────────────────────────

const PasswordSection = () => {
  const [step, setStep] = React.useState(1)
  const [newPassword, setNewPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [success, setSuccess] = React.useState(false)

  const form1 = useForm()
  const form2 = useForm()

  const sendCode = async (data) => {
    if (data.new_password !== data.new_password_repeat) {
      form1.setError('new_password_repeat', { message: 'Passwords do not match' })
      return
    }
    setLoading(true)
    setError(null)
    try {
      await api.patch(`${API_ROUTES.AUTH}/update/password`, {
        password: data.password,
        new_password: data.new_password,
        new_password_repeat: data.new_password_repeat,
      })
      setNewPassword(data.new_password)
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending code')
    } finally {
      setLoading(false)
    }
  }

  const verify = async (data) => {
    setLoading(true)
    setError(null)
    try {
      await api.patch(`${API_ROUTES.AUTH}/update/password/validation`, {
        password: newPassword,
        code: data.code,
      })
      setSuccess(true)
      setStep(1)
      form1.reset()
      form2.reset()
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  const cancel = () => {
    setStep(1)
    setError(null)
    form1.reset()
    form2.reset()
  }

  return (
    <Panel title="Password" description="A verification code will be sent to your email after submitting">
      {step === 1 && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Last changed: unknown
            </p>
            {success && <SuccessMessage message="Password updated successfully" />}
          </div>
          <SecondaryButton onClick={() => { setSuccess(false); setStep(2) }}>Change password</SecondaryButton>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={form1.handleSubmit(sendCode)} className="flex flex-col gap-4">
          <Field label="Current password" error={form1.formState.errors.password?.message}>
            <Input
              {...form1.register('password', { required: 'Current password is required' })}
              type="password"
            />
          </Field>
          <Field label="New password" error={form1.formState.errors.new_password?.message}>
            <Input
              {...form1.register('new_password', { required: 'New password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
              type="password"
            />
          </Field>
          <Field label="Confirm new password" error={form1.formState.errors.new_password_repeat?.message}>
            <Input
              {...form1.register('new_password_repeat', { required: 'Please confirm your password' })}
              type="password"
            />
          </Field>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <PrimaryButton loading={loading}>Send code</PrimaryButton>
            <SecondaryButton type="button" onClick={cancel}>Cancel</SecondaryButton>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={form2.handleSubmit(verify)} className="flex flex-col gap-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Enter the verification code sent to your email
          </p>
          <Field label="Verification code" error={form2.formState.errors.code?.message}>
            <Input
              {...form2.register('code', { required: 'Code is required' })}
              placeholder="000000"
            />
          </Field>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <PrimaryButton loading={loading}>Set new password</PrimaryButton>
            <SecondaryButton type="button" onClick={cancel}>Cancel</SecondaryButton>
          </div>
        </form>
      )}
    </Panel>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'security', label: 'Security' },
]

// ── Main page ─────────────────────────────────────────────────────────────────

export const SettingsPage = () => {
  const [tab, setTab] = React.useState('general')

  return (
    <div className="p-6 w-full md:w-2xl flex flex-col gap-6 mx-auto">
      <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-portal-border dark:border-dark-portal-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              "px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors cursor-pointer",
              tab === t.id
                ? "border-b-cyan-400 text-cyan-500 dark:text-cyan-400"
                : "border-b-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <>
          <ProfileSection />
          <EmailSection />
        </>
      )}

      {tab === 'security' && (
        <PasswordSection />
      )}
    </div>
  )
}
