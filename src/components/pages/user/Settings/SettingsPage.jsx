import React from 'react'
import clsx from 'clsx'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { CameraAltOutlined, ZoomInOutlined, ZoomOutOutlined, BadgeOutlined, AccountCircleOutlined, MailOutlined, LockOutlined, PinOutlined, MarkEmailReadOutlined } from '@mui/icons-material'
import { Dialog, DialogContent, DialogActions, Slider } from '@mui/material'
import Cropper from 'react-easy-crop'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { accountThunk } from '../../../../store/slices/account.slice'
import { Panel, SuccessMessage } from '../../../ui'
import { Button } from '../../../material/Button'
import { Input } from '../../../material/Input'
import useResendCode from '../../../../hooks/useResendCode'

// ── Resend control ────────────────────────────────────────────────────────────
// Shared by the email and password verification steps

const ResendCode = ({ email, emailNew = null }) => {
  const resend = useResendCode({ email, emailNew })

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={resend.resend}
        disabled={!resend.canResend}
        className={clsx(
          'text-xs font-medium transition-colors w-fit',
          resend.canResend
            ? 'text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer'
            : 'text-neutral-400 cursor-not-allowed',
        )}
      >
        {resend.sending
          ? 'Sending...'
          : resend.canResend
            ? 'Resend code'
            : `Resend code in ${resend.secondsLeft}s`}
      </button>
      {resend.sent && <p className="text-xs text-emerald-500">New code sent</p>}
      {resend.error && <p className="text-xs text-red-500">{resend.error}</p>}
    </div>
  )
}

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
  if (!pixelCrop?.width || !pixelCrop?.height) {
    throw new Error('Could not read the crop area. Move the image and try again.')
  }

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

  // toBlob hands back null when encoding fails; without this guard we would
  // ship a File built from null and the upload would silently send garbage.
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92))
  if (!blob) throw new Error('Could not process the image. Try a different file.')
  return blob
}

// ── crop dialog ───────────────────────────────────────────────────────────────

const CropDialog = ({ src, onConfirm, onCancel }) => {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null)
  const [working, setWorking] = React.useState(false)
  const [error, setError] = React.useState(null)

  const handleConfirm = async () => {
    setWorking(true)
    setError(null)
    try {
      const blob = await getCroppedBlob(src, croppedAreaPixels)
      onConfirm(blob)
    } catch (err) {
      // Without this the rejection was swallowed and the dialog just sat there
      setError(err.message || 'Could not process the image')
      console.error('Avatar crop failed:', err)
    } finally {
      setWorking(false)
    }
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
        {error && <p className="w-full text-sm text-red-500">{error}</p>}
        <div className="flex gap-2 w-full justify-end">
          <Button.User type="button" color="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button.User>
          <Button.User type="button" variant="normal" size="sm" loading={working} onClick={handleConfirm}>
            Apply
          </Button.User>
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

        <Input.User
          label="Display name"
          icon={<BadgeOutlined sx={{ fontSize: 18 }} />}
          error={errors.name?.message}
          {...register('name')}
          placeholder="Your full name"
        />

        <Input.User
          label="Username"
          icon={<AccountCircleOutlined sx={{ fontSize: 18 }} />}
          error={errors.username?.message}
          {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'At least 3 characters' } })}
        />

        <div className="flex items-center gap-3">
          <Button.User variant="normal" loading={loading}>Save changes</Button.User>
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
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Current email</p>
            <p className="font-medium text-neutral-900 dark:text-white">{account?.email}</p>
            {success && <SuccessMessage message="Email updated successfully" />}
          </div>
          <Button.User color="secondary" onClick={() => { setSuccess(false); setStep(2) }}>Change</Button.User>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={form1.handleSubmit(sendCode)} className="flex flex-col gap-4">
          <Input.User
            label="New email"
            icon={<MailOutlined sx={{ fontSize: 18 }} />}
            error={form1.formState.errors.email_new?.message}
            {...form1.register('email_new', { required: 'Email is required' })}
            type="email"
            placeholder="new@email.com"
          />
          <Input.User
            label="Confirm new email"
            icon={<MailOutlined sx={{ fontSize: 18 }} />}
            error={form1.formState.errors.email_new_repeat?.message}
            {...form1.register('email_new_repeat', { required: 'Confirm your email' })}
            type="email"
            placeholder="new@email.com"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <Button.User variant="normal" loading={loading}>Send code</Button.User>
            <Button.User type="button" color="secondary" onClick={cancel}>Cancel</Button.User>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={form2.handleSubmit(verify)} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 font-mono text-sm">
            <MarkEmailReadOutlined
              sx={{ fontSize: 30 }}
              className="shrink-0 mt-0.5 text-light-primary-500 dark:text-dark-primary-500"
            />
            <p className="text-center text-gray-500 dark:text-gray-400">
              We sent a security code to{' '}
              <span className="text-light-primary-500 dark:text-dark-primary-500 break-all">
                {newEmail}
              </span>
              . Enter it below to confirm the change.
            </p>
          </div>
          <Input.User
            label="Verification code"
            icon={<PinOutlined sx={{ fontSize: 18 }} />}
            error={form2.formState.errors.code?.message}
            {...form2.register('code', { required: 'Code is required' })}
            placeholder="000000"
          />
          <ResendCode email={account?.email} emailNew={newEmail} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <Button.User variant="normal" loading={loading}>Verify</Button.User>
            <Button.User type="button" color="secondary" onClick={cancel}>Cancel</Button.User>
          </div>
        </form>
      )}
    </Panel>
  )
}

// ── Password section ──────────────────────────────────────────────────────────

const PasswordSection = () => {
  const account = useSelector(state => state.account)
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
          <Button.User color="secondary" onClick={() => { setSuccess(false); setStep(2) }}>Change password</Button.User>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={form1.handleSubmit(sendCode)} className="flex flex-col gap-4">
          <Input.User
            label="Current password"
            icon={<LockOutlined sx={{ fontSize: 18 }} />}
            error={form1.formState.errors.password?.message}
            {...form1.register('password', { required: 'Current password is required' })}
            type="password"
          />
          <Input.User
            label="New password"
            icon={<LockOutlined sx={{ fontSize: 18 }} />}
            error={form1.formState.errors.new_password?.message}
            {...form1.register('new_password', { required: 'New password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
            type="password"
          />
          <Input.User
            label="Confirm new password"
            icon={<LockOutlined sx={{ fontSize: 18 }} />}
            error={form1.formState.errors.new_password_repeat?.message}
            {...form1.register('new_password_repeat', { required: 'Please confirm your password' })}
            type="password"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <Button.User variant="normal" loading={loading}>Send code</Button.User>
            <Button.User type="button" color="secondary" onClick={cancel}>Cancel</Button.User>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={form2.handleSubmit(verify)} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <MarkEmailReadOutlined sx={{ fontSize: 18 }} className="shrink-0 mt-0.5 text-cyan-500" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              We sent a security code to{' '}
              <span className="font-medium text-neutral-900 dark:text-white break-all">{account?.email}</span>
              . Enter it below to confirm the change.
            </p>
          </div>
          <Input.User
            label="Verification code"
            icon={<PinOutlined sx={{ fontSize: 18 }} />}
            error={form2.formState.errors.code?.message}
            {...form2.register('code', { required: 'Code is required' })}
            placeholder="000000"
          />
          <ResendCode email={account?.email} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <Button.User variant="normal" loading={loading}>Set new password</Button.User>
            <Button.User type="button" color="secondary" onClick={cancel}>Cancel</Button.User>
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
