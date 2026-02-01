import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the server utils before importing actions
vi.mock('@/app/utils/server', () => ({
  createClient: vi.fn(),
  getUser: vi.fn(),
}))

// Mock next/cache and next/navigation
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

import { createClient, getUser } from '@/app/utils/server'
import { signup, logout, volunteerSubmit, UserInfo } from '@/actions/users'

describe('Users Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signup', () => {
    it('should sign up a user successfully', async () => {
      const mockSupabase = {
        auth: {
          signUp: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const formData = {
        email: 'test@example.com',
        password: 'password123',
        repeatPassword: 'password123',
        firstname: 'John',
        lastname: 'Doe',
      }

      const result = await signup(formData)

      expect(result.success).toBe(true)
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            firstname: 'John',
            lastname: 'Doe',
            email: 'test@example.com',
          },
        },
      })
    })

    it('should return error when signup fails', async () => {
      const mockSupabase = {
        auth: {
          signUp: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Email already exists' },
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const formData = {
        email: 'existing@example.com',
        password: 'password123',
        repeatPassword: 'password123',
        firstname: 'John',
        lastname: 'Doe',
      }

      const result = await signup(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email already exists')
    })
  })

  describe('logout', () => {
    it('should sign out user successfully', async () => {
      const mockSupabase = {
        auth: {
          signOut: vi.fn().mockResolvedValue({ error: null }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      // logout calls redirect which may throw or not depending on mock
      try {
        await logout()
      } catch {
        // redirect throws in Next.js, but our mock may not
      }

      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('volunteerSubmit', () => {
    it('should submit volunteer form successfully', async () => {
      vi.mocked(getUser).mockResolvedValue({ id: 'user-123' } as any)

      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'volunteer_form') {
            return {
              insert: vi.fn().mockResolvedValue({ error: null }),
            }
          }
          if (table === 'users') {
            return {
              update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  select: vi.fn().mockResolvedValue({
                    data: { id: 'user-123', formcompleted: true },
                    error: null,
                  }),
                }),
              }),
            }
          }
          return {}
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const formData = {
        phone: '1234567890',
        emergencyContact: '0987654321',
        activities: ['events'] as ('events' | 'gardening' | 'companionship' | 'transport' | 'kitchen-help' | 'administration')[],
        inspiration: 'To help others',
        skills: 'Communication',
        interests: 'Environment',
        story: 'My story',
        certificate: ['clearance'] as ('clearance' | 'childrenCheck')[],
        availability: 'weekends',
      }

      const result = await volunteerSubmit(formData)

      expect(result.success).toBe(true)
    })

    it('should return error when user not logged in', async () => {
      vi.mocked(getUser).mockResolvedValue(null as any)

      const mockSupabase = {}
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const formData = {
        phone: '1234567890',
        emergencyContact: '0987654321',
        activities: ['events'] as ('events' | 'gardening' | 'companionship' | 'transport' | 'kitchen-help' | 'administration')[],
        inspiration: 'To help others',
        skills: 'Communication',
        interests: 'Environment',
        story: 'My story',
        certificate: ['clearance'] as ('clearance' | 'childrenCheck')[],
        availability: 'weekends',
      }

      const result = await volunteerSubmit(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('User not logged in')
    })

    it('should return error when insert fails', async () => {
      vi.mocked(getUser).mockResolvedValue({ id: 'user-123' } as any)

      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn().mockResolvedValue({
            error: { message: 'Insert failed' },
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const formData = {
        phone: '1234567890',
        emergencyContact: '0987654321',
        activities: ['events'] as ('events' | 'gardening' | 'companionship' | 'transport' | 'kitchen-help' | 'administration')[],
        inspiration: 'To help others',
        skills: 'Communication',
        interests: 'Environment',
        story: 'My story',
        certificate: ['clearance'] as ('clearance' | 'childrenCheck')[],
        availability: 'weekends',
      }

      const result = await volunteerSubmit(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insert failed')
    })
  })

  describe('UserInfo', () => {
    it('should fetch user info successfully', async () => {
      vi.mocked(getUser).mockResolvedValue({ id: 'user-123' } as any)

      const mockUserData = {
        id: 'user-123',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        role: 'crew',
      }

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockUserData,
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await UserInfo()

      expect(result.userData).toEqual(mockUserData)
    })
  })
})
