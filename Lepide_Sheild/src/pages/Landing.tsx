import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from '../lib/supabaseClient'
import LepideLogo from '../components/LepideLogo'

export default function Landing() {
  const navigate = useNavigate()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfiles() {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setProfiles(data ?? [])
      }
      setLoading(false)
    }

    loadProfiles()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-page px-4 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <LepideLogo />
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-field border border-border px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand"
          >
            Log out
          </button>
        </header>

        <div className="rounded-card bg-surface p-8 shadow-card">
          <h1 className="text-xl font-semibold text-ink">Registered people</h1>
          <p className="mt-1 text-sm text-ink-muted">
            People who have created a Lepide account.
          </p>

          {error && (
            <p role="alert" className="mt-4 rounded-field bg-danger-bg px-4 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          {loading ? (
            <p className="mt-6 text-sm text-ink-muted">Loading…</p>
          ) : profiles.length === 0 ? (
            <p className="mt-6 text-sm text-ink-muted">No one has registered yet.</p>
          ) : (
            <ul className="mt-6 flex flex-col divide-y divide-border-subtle">
              {profiles.map((profile) => (
                <li key={profile.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-ink">{profile.full_name}</p>
                    <p className="text-sm text-ink-muted">{profile.email}</p>
                  </div>
                  <span className="text-xs text-ink-disabled">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
