import { describe, it, expect, vi, beforeEach } from 'vitest'

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
import { GetMyVolunteering, cancelVolunteering } from '@/actions/my-volunteering'

describe('My Volunteering Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GetMyVolunteering', () => {
    it('should fetch user volunteering requests', async () => {
      vi.mocked(getUser).mockResolvedValue({ id: 'user-123' } as any)

      const mockData = [
        {
          id: 'req-1',
          status: 'approved',
          events: { id: 'event-1', title: 'Beach Cleanup' },
          event_roles: { role_name: 'Volunteer' },
        },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              neq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockData,
                  error: null,
                }),
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await GetMyVolunteering()

      expect(result.data).toEqual(mockData)
    })

    it('should redirect if user not logged in', async () => {
      vi.mocked(getUser).mockResolvedValue(null as any)

      const mockSupabase = {}
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      // GetMyVolunteering calls redirect which throws
      await expect(GetMyVolunteering()).rejects.toThrow()
    })
  })

  describe('cancelVolunteering', () => {
    it('should cancel volunteering request successfully', async () => {
      vi.mocked(getUser).mockResolvedValue({ id: 'user-123' } as any)

      const mockSupabase = {
        from: vi.fn(() => ({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await cancelVolunteering('request-123')

      expect(result.success).toBe(true)
    })

    it('should return error when user not authenticated', async () => {
      vi.mocked(getUser).mockResolvedValue(null as any)

      const mockSupabase = {}
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await cancelVolunteering('request-123')

      expect(result.error).toBe('Not authenticated')
    })

    it('should return error when cancellation fails', async () => {
      vi.mocked(getUser).mockResolvedValue({ id: 'user-123' } as any)

      const mockSupabase = {
        from: vi.fn(() => ({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                error: { message: 'Delete failed' },
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await cancelVolunteering('request-123')

      expect(result.error).toBe('Delete failed')
    })
  })
})
