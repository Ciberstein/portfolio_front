import React from 'react'
import { AddOutlined, DeleteOutlined, TranslateOutlined } from '@mui/icons-material'
import { Dialog, DialogContent, Slider } from '@mui/material'
import api from '../../../../api/axios'
import { API_ROUTES } from '../../../../api/routes'
import { Panel } from '../../../ui'
import { Button } from '../../../material/Button'
import { Input } from '../../../material/Input'

const BASE = `${API_ROUTES.ADMIN}/settings/languages`

const LanguageDialog = ({ item, count, onClose, onSaved }) => {
  const [name, setName] = React.useState(item?.name || '')
  const [level, setLevel] = React.useState(item?.level ?? 50)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const save = async () => {
    if (!name.trim()) { setError('Name is required'); return }
    setLoading(true)
    setError(null)
    try {
      const payload = { name: name.trim(), level, order: item?.order ?? count }
      if (item) await api.patch(`${BASE}/${item.id}`, payload)
      else      await api.post(BASE, payload)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save')
    } finally { setLoading(false) }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
          {item ? 'Edit language' : 'Add language'}
        </h2>
        <div className="flex flex-col gap-4">
          <Input.User
            label="Language"
            icon={<TranslateOutlined sx={{ fontSize: 18 }} />}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), save())}
            placeholder="English"
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Level</span>
              <span className="text-xs font-mono text-cyan-500">{level}%</span>
            </div>
            <Slider min={0} max={100} step={5} value={level} onChange={(_, v) => setLevel(v)} size="small" />
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

export const LanguagesPage = () => {
  const [languages, setLanguages] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [dialog, setDialog] = React.useState(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try { const { data } = await api.get(BASE); setLanguages(data) }
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
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{languages.length} languages</p>
        <Button.User variant="normal" className="gap-1.5" onClick={() => setDialog('add')}>
          <AddOutlined sx={{ fontSize: 16 }} />
          Add
        </Button.User>
      </div>

      <Panel className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-portal-border dark:border-dark-portal-border text-left">
              <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Language</th>
              <th className="px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Level</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={3} className="px-4 py-8 text-center text-neutral-400">Loading...</td></tr>}
            {!loading && languages.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-neutral-400">No languages yet</td></tr>
            )}
            {!loading && languages.map(lang => (
              <tr key={lang.id} className="border-b border-portal-border dark:border-dark-portal-border last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">{lang.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-portal-border dark:bg-dark-portal-border overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${lang.level}%` }} />
                    </div>
                    <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 w-8 text-right">{lang.level}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Button.Icon color="neutral" size="md"
                      onClick={() => setDialog(lang)}
                      >
                      <TranslateOutlined sx={{ fontSize: 15 }} />
                    </Button.Icon>
                    <Button.Icon color="danger" size="md"
                      onClick={() => remove(lang.id)}
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
        <LanguageDialog
          item={dialog === 'add' ? null : dialog}
          count={languages.length}
          onClose={() => setDialog(null)}
          onSaved={() => { setDialog(null); load() }}
        />
      )}
    </>
  )
}
