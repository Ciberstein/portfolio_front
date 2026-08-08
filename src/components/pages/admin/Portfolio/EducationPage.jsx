import React from 'react'
import { useForm } from 'react-hook-form'
import {
  AddOutlined, EditOutlined, DeleteOutlined,
  SchoolOutlined, WorkspacePremiumOutlined, CalendarTodayOutlined,
} from '@mui/icons-material'
import { Dialog, DialogContent } from '@mui/material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel } from '../../../ui'
import { Button } from '../../../material/Button'
import { Input } from '../../../material/Input'

const BASE = `${API_ROUTES.ADMIN}/portfolio`

const dateScheme = "[color-scheme:light] dark:[color-scheme:dark]"

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Same rules the CV prints with, so the table reads exactly like the document.
// DATEONLY strings are split by hand: new Date("2017-12-31") is UTC midnight
// and would fall back to November in western timezones.
const parts = (value) => {
  if (!value) return null
  const [year, month] = String(value).split('-')
  return { year, month: MONTHS[parseInt(month, 10) - 1] }
}

const stamp = (value) => {
  const p = parts(value)
  return p ? `${p.month} ${p.year}` : ''
}

const period = (startAt, endsAt) => {
  if (!startAt && !endsAt) return '—'
  if (!startAt) return parts(endsAt).year
  if (!endsAt) return `${stamp(startAt)} - Present`
  const from = stamp(startAt)
  const to = stamp(endsAt)
  return from === to ? from : `${from} - ${to}`
}

// ── Dialog ────────────────────────────────────────────────────────────────────

const EducationDialog = ({ item, onClose, onSaved }) => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      institution: item?.institution || '',
      title:       item?.title       || '',
      startAt:     item?.startAt     || '',
      endsAt:      item?.endsAt      || '',
      order:       item?.order ?? 0,
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      if (item) await api.patch(`${BASE}/education/${item.id}`, data)
      else      await api.post(`${BASE}/education`, data)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving education entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
          {item ? 'Edit education' : 'Add education'}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Studies and courses printed on your downloadable CV.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input.User
            label="Institution"
            icon={<SchoolOutlined sx={{ fontSize: 18 }} />}
            error={errors.institution?.message}
            {...register('institution', { required: 'Required' })}
            placeholder="Universidad Alejandro Humboldt"
          />

          <Input.User
            label="Title"
            icon={<WorkspacePremiumOutlined sx={{ fontSize: 18 }} />}
            error={errors.title?.message}
            {...register('title', { required: 'Required' })}
            placeholder="Ingeniería Informática"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input.User
              label={<>Start date <span className="font-normal text-neutral-400">(optional)</span></>}
              icon={<CalendarTodayOutlined sx={{ fontSize: 18 }} />}
              {...register('startAt')}
              type="date"
              className={dateScheme}
            />
            {/* Empty means ongoing, matching how experience end dates work */}
            <Input.User
              label={<>End date <span className="font-normal text-neutral-400">(optional)</span></>}
              icon={<CalendarTodayOutlined sx={{ fontSize: 18 }} />}
              {...register('endsAt')}
              type="date"
              className={dateScheme}
            />
          </div>

          <Input.User
            label="Order"
            type="number"
            {...register('order')}
            placeholder="0"
          />

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

export const EducationPage = () => {
  const [education, setEducation] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [dialog, setDialog] = React.useState(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try { const { data } = await api.get(`${BASE}/education`); setEducation(data) }
    catch { } finally { setLoading(false) }
  }, [])

  React.useEffect(() => { load() }, [load])

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {education.length} entries · shown on your CV
        </p>
        <Button.User variant="normal" className="gap-1.5" onClick={() => setDialog('add')}>
          <AddOutlined sx={{ fontSize: 16 }} />
          Add
        </Button.User>
      </div>

      <Panel className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-portal-border dark:border-dark-portal-border text-left">
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Institution</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Title</th>
                <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap">Period</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-neutral-400">Loading...</td></tr>
              )}
              {!loading && education.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-neutral-400">No education entries yet</td></tr>
              )}
              {!loading && education.map(item => (
                <tr key={item.id} className="border-b border-portal-border dark:border-dark-portal-border last:border-0">
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">{item.institution}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">{item.title}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {period(item.startAt, item.endsAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button.Icon color="neutral" size="md" onClick={() => setDialog(item)}>
                        <EditOutlined sx={{ fontSize: 15 }} />
                      </Button.Icon>
                      <Button.Icon color="danger" size="md"
                        onClick={async () => { await api.delete(`${BASE}/education/${item.id}`); load() }}
                      >
                        <DeleteOutlined sx={{ fontSize: 15 }} />
                      </Button.Icon>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {dialog !== null && (
        <EducationDialog
          item={dialog === 'add' ? null : dialog}
          onClose={() => setDialog(null)}
          onSaved={() => { setDialog(null); load() }}
        />
      )}
    </>
  )
}
