import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/app/utils/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { createClient } from '@/app/utils/server'
import {
  FetchCrew,
  fetchAdmins,
  UpdateUserRole,
  MakeUserAdmin,
  RemoveAdminPrivileges,
  BanUser,
  DeleteUser,
  FetchVolunteerForm,
  FetchPendingApplications,
  FetchAcceptedApplications,
  FetchRejectedApplications,
} from '@/actions/crew'

describe('Crew Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('FetchCrew', () => {
    it('should fetch crew members with specific roles', async () => {
      const mockCrew = [
        { id: '1', firstname: 'John', role: 'Kindler' },
        { id: '2', firstname: 'Jane', role: 'Flame' },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: mockCrew,
              error: null,
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchCrew()

      expect(result.data).toEqual(mockCrew)
    })

    it('should filter by search query', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              or: vi.fn().mockResolvedValue({
                data: [{ id: '1', firstname: 'John' }],
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchCrew('John')

      expect(result.data).toBeDefined()
    })

    it('should return error on failure', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchCrew()

      expect(result.error).toBe('Database error')
    })
  })

  describe('fetchAdmins', () => {
    it('should fetch admin users', async () => {
      const mockAdmins = [
        { id: '1', firstname: 'Admin', role: 'admin' },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: mockAdmins,
              error: null,
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await fetchAdmins()

      expect(result.data).toEqual(mockAdmins)
    })
  })

  describe('UpdateUserRole', () => {
    it('should update user role successfully', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockResolvedValue({
                data: { id: 'user-1', role: 'Flame' },
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await UpdateUserRole('user-1', 'Flame')

      expect(result.success).toBe(true)
    })

    it('should return error on failure', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Update failed' },
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await UpdateUserRole('user-1', 'Flame')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Update failed')
    })
  })

  describe('MakeUserAdmin', () => {
    it('should make user admin successfully', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await MakeUserAdmin('user-1')

      expect(result.success).toBe(true)
    })
  })

  describe('RemoveAdminPrivileges', () => {
    it('should remove admin privileges successfully', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockResolvedValue({
                data: { id: 'user-1', role: 'Kindling' },
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await RemoveAdminPrivileges('user-1')

      expect(result.success).toBe(true)
    })
  })

  describe('BanUser', () => {
    it('should ban user successfully', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockResolvedValue({
                data: { id: 'user-1', status: 'banned' },
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await BanUser('user-1')

      expect(result.success).toBe(true)
    })

    it('should return error on failure', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Ban failed' },
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await BanUser('user-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Ban failed')
    })
  })

  describe('DeleteUser', () => {
    it('should delete user successfully', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await DeleteUser('user-1')

      expect(result.success).toBe(true)
    })

    it('should return error on failure', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: { message: 'Delete failed' },
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await DeleteUser('user-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Delete failed')
    })
  })

  describe('FetchVolunteerForm', () => {
    it('should fetch volunteer form for user', async () => {
      const mockForm = {
        id: 'form-1',
        phone: '1234567890',
        users: { firstname: 'John' },
      }

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockForm,
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchVolunteerForm('user-1')

      expect(result.data).toEqual(mockForm)
    })
  })

  describe('FetchPendingApplications', () => {
    it('should fetch pending applications', async () => {
      const mockApps = [
        { id: '1', status: 'Pending', users: { firstname: 'John' } },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: mockApps,
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchPendingApplications()

      expect(result.data).toEqual(mockApps)
    })
  })

  describe('FetchAcceptedApplications', () => {
    it('should fetch accepted applications', async () => {
      const mockApps = [
        { id: '1', status: 'Approved', users: { firstname: 'John' } },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: mockApps,
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchAcceptedApplications()

      expect(result.data).toEqual(mockApps)
    })
  })

  describe('FetchRejectedApplications', () => {
    it('should fetch rejected applications', async () => {
      const mockApps = [
        { id: '1', status: 'Rejected', users: { firstname: 'John' } },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: mockApps,
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchRejectedApplications()

      expect(result.data).toEqual(mockApps)
    })
  })
})
