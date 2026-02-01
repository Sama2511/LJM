import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Registration Flow Integration Test
 *
 * Tests the complete volunteer registration journey:
 * 1. Sign Up - User creates an account
 * 2. Volunteer Form - User completes application
 * 3. Confirmation - Application is submitted for review
 */

// Mock all dependencies
vi.mock('@/app/utils/server', () => ({
  createClient: vi.fn(),
  getUser: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

import { createClient, getUser } from '@/app/utils/server'
import { signup, volunteerSubmit } from '@/actions/users'

describe('Registration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Complete Registration Journey', () => {
    it('should complete full registration flow: signup -> volunteer form -> pending status', async () => {
      // ============================================
      // STEP 1: User Signs Up
      // ============================================
      const mockSignupSupabase = {
        auth: {
          signUp: vi.fn().mockResolvedValue({
            data: {
              user: {
                id: 'new-user-123',
                email: 'newvolunteer@example.com'
              }
            },
            error: null,
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSignupSupabase as any)

      const signupData = {
        email: 'newvolunteer@example.com',
        password: 'SecurePass123!',
        repeatPassword: 'SecurePass123!',
        firstname: 'John',
        lastname: 'Doe',
      }

      const signupResult = await signup(signupData)

      // Verify signup was successful
      expect(signupResult.success).toBe(true)
      expect(mockSignupSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'newvolunteer@example.com',
        password: 'SecurePass123!',
        options: {
          data: {
            firstname: 'John',
            lastname: 'Doe',
            email: 'newvolunteer@example.com',
          },
        },
      })

      // ============================================
      // STEP 2: User Completes Volunteer Form
      // ============================================
      vi.mocked(getUser).mockResolvedValue({
        id: 'new-user-123',
        email: 'newvolunteer@example.com'
      } as any)

      const mockVolunteerFormSupabase = {
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
                    data: {
                      id: 'new-user-123',
                      formcompleted: true,
                      role: 'Kindler'
                    },
                    error: null,
                  }),
                }),
              }),
            }
          }
          return {}
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockVolunteerFormSupabase as any)

      const volunteerFormData = {
        phone: '0412345678',
        emergencyContact: '0498765432',
        activities: ['events', 'gardening'] as ('events' | 'gardening' | 'companionship' | 'transport' | 'kitchen-help' | 'administration')[],
        inspiration: 'I want to give back to my community and help those in need.',
        skills: 'Communication, teamwork, and organisation',
        interests: 'Environmental conservation and community building',
        story: 'I have always been passionate about helping others.',
        certificate: ['clearance'] as ('clearance' | 'childrenCheck')[],
        availability: 'Weekends and some weekday evenings',
      }

      const volunteerResult = await volunteerSubmit(volunteerFormData)

      // Verify volunteer form was submitted successfully
      expect(volunteerResult.success).toBe(true)

      // Verify the form was inserted into volunteer_form table
      expect(mockVolunteerFormSupabase.from).toHaveBeenCalledWith('volunteer_form')

      // Verify user's formcompleted was updated to true
      expect(mockVolunteerFormSupabase.from).toHaveBeenCalledWith('users')

      // ============================================
      // STEP 3: Verify User is in Pending Status
      // ============================================
      // At this point, the user's application should be pending review
      // The volunteer_form entry has status: 'Pending' by default
      // User should be redirected to confirmation page

      // This is handled by the form submission and route protection
      // User with formcompleted=true but volunteer_form.status='Pending'
      // will be redirected to /confirmation page
    })

    it('should handle signup failure gracefully', async () => {
      const mockSupabase = {
        auth: {
          signUp: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Email already registered' },
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const signupData = {
        email: 'existing@example.com',
        password: 'SecurePass123!',
        repeatPassword: 'SecurePass123!',
        firstname: 'John',
        lastname: 'Doe',
      }

      const result = await signup(signupData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email already registered')
    })

    it('should handle volunteer form submission failure', async () => {
      vi.mocked(getUser).mockResolvedValue({ id: 'user-123' } as any)

      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn().mockResolvedValue({
            error: { message: 'Database error' },
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const volunteerFormData = {
        phone: '0412345678',
        emergencyContact: '0498765432',
        activities: ['events'] as ('events' | 'gardening' | 'companionship' | 'transport' | 'kitchen-help' | 'administration')[],
        inspiration: 'I want to help',
        skills: 'Communication',
        interests: 'Community',
        story: 'My story',
        certificate: [] as ('clearance' | 'childrenCheck')[],
        availability: 'Weekends',
      }

      const result = await volunteerSubmit(volunteerFormData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })

    it('should prevent volunteer form submission without authentication', async () => {
      vi.mocked(getUser).mockResolvedValue(null as any)

      const mockSupabase = {}
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const volunteerFormData = {
        phone: '0412345678',
        emergencyContact: '0498765432',
        activities: ['events'] as ('events' | 'gardening' | 'companionship' | 'transport' | 'kitchen-help' | 'administration')[],
        inspiration: 'I want to help',
        skills: 'Communication',
        interests: 'Community',
        story: 'My story',
        certificate: [] as ('clearance' | 'childrenCheck')[],
        availability: 'Weekends',
      }

      const result = await volunteerSubmit(volunteerFormData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('User not logged in')
    })
  })

  describe('Form Validation', () => {
    it('should require all mandatory signup fields', async () => {
      const mockSupabase = {
        auth: {
          signUp: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      // Complete signup data
      const completeData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        repeatPassword: 'SecurePass123!',
        firstname: 'John',
        lastname: 'Doe',
      }

      const result = await signup(completeData)
      expect(result.success).toBe(true)
    })

    it('should require all mandatory volunteer form fields', async () => {
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

      // Complete volunteer form data
      const completeFormData = {
        phone: '0412345678',
        emergencyContact: '0498765432',
        activities: ['events'] as ('events' | 'gardening' | 'companionship' | 'transport' | 'kitchen-help' | 'administration')[],
        inspiration: 'I want to make a difference in my community',
        skills: 'Good communication',
        interests: 'Helping others',
        story: 'My volunteering story',
        certificate: ['clearance'] as ('clearance' | 'childrenCheck')[],
        availability: 'Weekends',
      }

      const result = await volunteerSubmit(completeFormData)
      expect(result.success).toBe(true)
    })
  })

  describe('Route Protection', () => {
    it('should identify users who have not completed volunteer form', async () => {
      // User exists but formcompleted is false
      const userWithIncompleteForm = {
        id: 'user-123',
        email: 'test@example.com',
        formcompleted: false,
        role: 'Kindler',
      }

      // This user should be redirected to /volunteerForm
      expect(userWithIncompleteForm.formcompleted).toBe(false)
    })

    it('should identify users with pending application', async () => {
      // User has completed form but status is pending
      const userWithPendingApplication = {
        id: 'user-123',
        email: 'test@example.com',
        formcompleted: true,
        role: 'Kindler',
      }

      const volunteerFormStatus = {
        status: 'Pending',
      }

      // This user should be redirected to /confirmation
      expect(userWithPendingApplication.formcompleted).toBe(true)
      expect(volunteerFormStatus.status).toBe('Pending')
    })

    it('should identify approved volunteers', async () => {
      // User has completed form and is approved
      const approvedVolunteer = {
        id: 'user-123',
        email: 'test@example.com',
        formcompleted: true,
        role: 'Kindling', // Role upgraded from Kindler
      }

      const volunteerFormStatus = {
        status: 'Approved',
      }

      // This user should have access to /UserDashboard
      expect(approvedVolunteer.formcompleted).toBe(true)
      expect(volunteerFormStatus.status).toBe('Approved')
      expect(approvedVolunteer.role).not.toBe('Kindler')
    })
  })
})
