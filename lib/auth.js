import { supabase } from './supabase'

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { error: error?.message || null, user: data?.user || null }
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  return !error
}

export async function verificarSesion() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined'
      ? window.location.origin + '/login'
      : ''
  })
  return { error: error?.message || null }
}
