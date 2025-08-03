import { useState, useEffect } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  email: string
  name: string | null
  role: 'buyer' | 'agent' | 'admin'
  verified: boolean | null
  phone: string | null
  created_at: string
  updated_at: string
}

interface AuthState {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
}

interface SignUpData {
  email: string
  password: string
  name: string
  role: 'buyer' | 'agent'
}

interface SignInData {
  email: string
  password: string
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true
  })

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false
      }))
      
      // Fetch user profile if session exists
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false
      }))
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setAuthState(prev => ({
          ...prev,
          profile: null
        }))
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch user profile from public.users table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user profile:', error)
        return
      }

      setAuthState(prev => ({
        ...prev,
        profile: data
      }))
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  // Sign up new user
  const signUp = async ({ email, password, name, role }: SignUpData): Promise<{ error: AuthError | Error | null }> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      })

      if (authError) {
        return { error: authError }
      }

      // If auth user created successfully, create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email,
              name,
              role,
              verified: false
            }
          ])

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          return { error: new Error('Failed to create user profile') }
        }
      }

      return { error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: error as Error }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  // Sign in existing user
  const signIn = async ({ email, password }: SignInData): Promise<{ error: AuthError | null }> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      return { error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: error as AuthError }
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  // Sign out user
  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: error as AuthError }
    }
  }

  // Check if user is authenticated
  const isAuthenticated = !!authState.user

  // Check if user has specific role
  const hasRole = (role: 'buyer' | 'agent' | 'admin'): boolean => {
    return authState.profile?.role === role
  }

  // Check if user is verified
  const isVerified = (): boolean => {
    return authState.profile?.verified === true
  }

  return {
    // State
    user: authState.user,
    profile: authState.profile,
    session: authState.session,
    loading: authState.loading,
    isAuthenticated,
    
    // Actions
    signUp,
    signIn,
    signOut,
    
    // Utilities
    hasRole,
    isVerified,
    fetchUserProfile
  }
} 