import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the server utils before importing actions
vi.mock('@/app/utils/server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '@/app/utils/server'
import {
  JoinEvent,
  GetEventRolesWithCapacity,
  GetUserVolunteerRequests,
  ApproveApplication,
  RejectApplication,
  RemoveVolunteerFromEvent,
} from '@/actions/volunteer'

describe('Volunteer Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('JoinEvent', () => {
    it('should allow user to join event when role has capacity', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
        from: vi.fn((table: string) => {
          if (table === 'event_roles') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { capacity: 10 },
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === 'volunteer_requests') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({
                    count: 5,
                    error: null,
                  }),
                }),
              }),
              insert: vi.fn().mockResolvedValue({ error: null }),
            }
          }
          return {}
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await JoinEvent('event-123', 'role-456')

      expect(result.success).toBe(true)
    })

    it('should reject when user is not authenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await JoinEvent('event-123', 'role-456')

      expect(result.success).toBe(false)
      expect(result.message).toBe('Not authenticated')
    })

    it('should reject when role is full', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
        from: vi.fn((table: string) => {
          if (table === 'event_roles') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { capacity: 5 },
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === 'volunteer_requests') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({
                    count: 5, // Full capacity
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

      const result = await JoinEvent('event-123', 'role-456')

      expect(result.success).toBe(false)
      expect(result.message).toBe('This role is full')
    })

    it('should reject when role not found', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
          }),
        },
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await JoinEvent('event-123', 'invalid-role')

      expect(result.success).toBe(false)
      expect(result.message).toBe('Role not found')
    })
  })

  describe('GetEventRolesWithCapacity', () => {
    it('should return roles with filled and available counts', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'event_roles') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [
                    { id: 'role-1', role_name: 'Volunteer', capacity: 10 },
                    { id: 'role-2', role_name: 'Lead', capacity: 2 },
                  ],
                  error: null,
                }),
              }),
            }
          }
          if (table === 'volunteer_requests') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({
                    data: [
                      { role_id: 'role-1' },
                      { role_id: 'role-1' },
                      { role_id: 'role-1' },
                      { role_id: 'role-2' },
                    ],
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

      const result = await GetEventRolesWithCapacity('event-123')

      expect(result.data).toBeDefined()
      expect(result.data?.length).toBe(2)
      expect(result.data?.[0].filled).toBe(3)
      expect(result.data?.[0].available).toBe(7)
      expect(result.data?.[1].filled).toBe(1)
      expect(result.data?.[1].available).toBe(1)
    })
  })

  describe('GetUserVolunteerRequests', () => {
    it('should return user volunteer requests', async () => {
      const mockRequests = [
        { event_id: 'event-1', status: 'approved' },
        { event_id: 'event-2', status: 'pending' },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockRequests,
              error: null,
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await GetUserVolunteerRequests('user-123')

      expect(result.data).toEqual(mockRequests)
    })
  })

  describe('ApproveApplication', () => {
    it('should approve application and send notification', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'volunteer_form') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { user_id: 'user-123' },
                    error: null,
                  }),
                }),
              }),
              update: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
              }),
            }
          }
          if (table === 'notifications') {
            return {
              insert: vi.fn().mockResolvedValue({ error: null }),
            }
          }
          return {}
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await ApproveApplication('form-123')

      expect(result.success).toBe(true)
    })

    it('should return error when approval fails', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'volunteer_form') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { user_id: 'user-123' },
                    error: null,
                  }),
                }),
              }),
              update: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  error: { message: 'Update failed' },
                }),
              }),
            }
          }
          return {}
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await ApproveApplication('form-123')

      expect(result.error).toBe('Update failed')
    })
  })

  describe('RejectApplication', () => {
    it('should reject application and send notification', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'volunteer_form') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { user_id: 'user-123' },
                    error: null,
                  }),
                }),
              }),
              update: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
              }),
            }
          }
          if (table === 'notifications') {
            return {
              insert: vi.fn().mockResolvedValue({ error: null }),
            }
          }
          return {}
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await RejectApplication('form-123')

      expect(result.success).toBe(true)
    })
  })

  describe('RemoveVolunteerFromEvent', () => {
    it('should remove volunteer and send notification', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'volunteer_requests') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: {
                      user_id: 'user-123',
                      event_id: 'event-456',
                      events: { title: 'Test Event' },
                    },
                    error: null,
                  }),
                }),
              }),
              delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
              }),
            }
          }
          if (table === 'notifications') {
            return {
              insert: vi.fn().mockResolvedValue({ error: null }),
            }
          }
          return {}
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await RemoveVolunteerFromEvent('request-123', 'Test Event')

      expect(result.success).toBe(true)
    })

    it('should return error when request not found', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await RemoveVolunteerFromEvent('invalid-request', 'Test Event')

      expect(result.error).toBe('Volunteer request not found')
    })
  })
})
