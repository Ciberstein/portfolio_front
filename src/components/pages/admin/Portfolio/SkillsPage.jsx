import React from 'react'
import clsx from 'clsx'
import { useForm, Controller } from 'react-hook-form'
import { AddOutlined, EditOutlined, DeleteOutlined, AutoAwesomeOutlined, CategoryOutlined } from '@mui/icons-material'
import { Dialog, DialogContent } from '@mui/material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel } from '../../../ui'
import { Button } from '../../../material/Button'
import { Input } from '../../../material/Input'
import { Select } from '../../../material/Select'

const BASE = `${API_ROUTES.ADMIN}/portfolio`

// Languages fill the landing's "Programming Skills" card and the CV's
// languages column; technologies only ever appear on the CV.
const CATEGORIES = [
  { value: 'language',   label: 'Programming language' },
  { value: 'technology', label: 'Technology' },
]

// ── Dialog ────────────────────────────────────────────────────────────────────

const SkillDialog = ({ item, onClose, onSaved }) => {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: { name: item?.name || '', category: item?.category || 'language' },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const payload = { name: data.name, category: data.category }
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
          <Input.User label="Name" icon={<AutoAwesomeOutlined sx={{ fontSize: 18 }} />} error={errors.name?.message} {...register('name', { required: 'Name is required' })} placeholder="Skill name" />

          <Controller name="category" control={control} render={({ field }) => (
            <Select.User
              label="Category"
              icon={<CategoryOutlined sx={{ fontSize: 18 }} />}
              options={CATEGORIES}
              value={field.value}
              onChange={field.onChange}
            />
          )} />

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

export const SkillsPage = () => {
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
        <Button.User variant="normal" className="gap-1.5" onClick={() => setDialog('add')}>
          <AddOutlined sx={{ fontSize: 16 }} />
          Add
        </Button.User>
      </div>

      <Panel className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-portal-border dark:border-dark-portal-border text-left">
              <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Skill</th>
              <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Category</th>
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
                  <span className={clsx(
                    'px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap',
                    skill.category === 'technology'
                      ? 'bg-violet-400/10 text-violet-600 dark:text-violet-400'
                      : 'bg-cyan-400/10 text-cyan-600 dark:text-cyan-400',
                  )}>
                    {skill.category === 'technology' ? 'Technology' : 'Language'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Button.Icon color="neutral" size="md"
                      onClick={() => setDialog(skill)}
                      >
                      <EditOutlined sx={{ fontSize: 15 }} />
                    </Button.Icon>
                    <Button.Icon color="danger" size="md"
                      onClick={async () => { await api.delete(`${BASE}/skills/${skill.id}`); load() }}
                      >
                      <DeleteOutlined sx={{ fontSize: 15 }} />
                    </Button.Icon>
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
