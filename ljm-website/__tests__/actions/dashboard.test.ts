import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the server utils before importing actions
vi.mock('@/app/utils/server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '@/app/utils/server'
import {
  FetchDashboardStats,
  FetchRecentApplications,
  FetchUpcomingEvents,
  FetchRecentVolunteers,
} from '@/actions/dashboard'

describe('Dashboard Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('FetchDashboardStats', () => {
    it('should fetch all dashboard stats in parallel', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          const counts: Record<string, number> = {
            events: 15,
            users: 50,
            volunteer_form: 5,
            articles: 10,
            documents: 8,
          }

          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                // For pending volunteer forms
                then: (resolve: any) => resolve({ count: 5, error: null }),
              }),
              gte: vi.fn().mockReturnValue({
                // For upcoming events
                then: (resolve: any) => resolve({ count: 8, error: null }),
              }),
              then: (resolve: any) => resolve({ count: counts[table] || 0, error: null }),
            }),
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchDashboardStats()

      expect(result).toHaveProperty('totalEvents')
      expect(result).toHaveProperty('upcomingEvents')
      expect(result).toHaveProperty('totalVolunteers')
      expect(result).toHaveProperty('pendingApplications')
      expect(result).toHaveProperty('totalArticles')
      expect(result).toHaveProperty('totalDocuments')
    })

    it('should return 0 for counts when queries fail', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              then: (resolve: any) => resolve({ count: null, error: { message: 'Error' } }),
            }),
            gte: vi.fn().mockReturnValue({
              then: (resolve: any) => resolve({ count: null, error: { message: 'Error' } }),
            }),
            then: (resolve: any) => resolve({ count: null, error: { message: 'Error' } }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchDashboardStats()

      expect(result.totalEvents).toBe(0)
      expect(result.upcomingEvents).toBe(0)
      expect(result.totalVolunteers).toBe(0)
      expect(result.pendingApplications).toBe(0)
      expect(result.totalArticles).toBe(0)
      expect(result.totalDocuments).toBe(0)
    })
  })

  describe('FetchRecentApplications', () => {
    it('should fetch recent applications ordered by date', async () => {
      const mockApplications = [
        {
          id: '1',
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com',
          status: 'pending',
          created_at: '2024-01-15',
        },
        {
          id: '2',
          firstname: 'Jane',
          lastname: 'Smith',
          email: 'jane@example.com',
          status: 'approved',
          created_at: '2024-01-14',
        },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: mockApplications,
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchRecentApplications()

      expect(result).toEqual(mockApplications)
      expect(result.length).toBe(2)
    })

    it('should return empty array on error', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchRecentApplications()

      expect(result).toEqual([])
    })
  })

  describe('FetchUpcomingEvents', () => {
    it('should fetch upcoming events with signup counts', async () => {
      const mockEvents = [
        { id: 'event-1', title: 'Event 1', date: '2024-12-25', time: '10:00', capacity: 20 },
        { id: 'event-2', title: 'Event 2', date: '2024-12-26', time: '14:00', capacity: 15 },
      ]

      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'events') {
            return {
              select: vi.fn().mockReturnValue({
                gte: vi.fn().mockReturnValue({
                  order: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue({
                      data: mockEvents,
                      error: null,
                    }),
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
            }
          }
          return {}
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchUpcomingEvents()

      expect(result.length).toBe(2)
      expect(result[0]).toHaveProperty('current_signups')
    })

    it('should return empty array on error', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Database error' },
                }),
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchUpcomingEvents()

      expect(result).toEqual([])
    })
  })

  describe('FetchRecentVolunteers', () => {
    it('should fetch recent volunteers with user and event details', async () => {
      const mockVolunteers = [
        {
          id: 'vol-1',
          user_id: 'user-1',
          event_id: 'event-1',
          created_at: '2024-01-15',
          users: { firstname: 'John', lastname: 'Doe' },
          events: { title: 'Beach Cleanup' },
        },
        {
          id: 'vol-2',
          user_id: 'user-2',
          event_id: 'event-2',
          created_at: '2024-01-14',
          users: { firstname: 'Jane', lastname: 'Smith' },
          events: { title: 'Food Drive' },
        },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: mockVolunteers,
                  error: null,
                }),
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchRecentVolunteers()

      expect(result).toEqual(mockVolunteers)
      expect(result[0].users.firstname).toBe('John')
      expect(result[0].events.title).toBe('Beach Cleanup')
    })

    it('should return empty array on error', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Database error' },
                }),
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchRecentVolunteers()

      expect(result).toEqual([])
    })
  })
})
