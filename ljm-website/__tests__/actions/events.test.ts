import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the server utils before importing actions
vi.mock('@/app/utils/server', () => ({
  createClient: vi.fn(),
}))

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { createClient } from '@/app/utils/server'
import { CreateEvent, FetchEvent, DeleteEvent, FetchEventForEdit, UpdateEvent } from '@/actions/events'

describe('Events Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('CreateEvent', () => {
    it('should create an event successfully', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'events') {
            return {
              insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'event-123', title: 'Test Event' },
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === 'event_roles') {
            return {
              insert: vi.fn().mockResolvedValue({ error: null }),
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

      const formData = {
        title: 'Test Event',
        description: 'Test Description',
        date: new Date('2024-12-25'),
        starts_at: '10:00',
        ends_at: '14:00',
        location: 'Test Location',
        image_url: 'test.jpg',
        roles: [
          { role_name: 'Volunteer', capacity: 10 },
          { role_name: 'Coordinator', capacity: 2 },
        ],
      }

      const result = await CreateEvent(formData)

      expect(result.success).toBe(true)
      expect(mockSupabase.from).toHaveBeenCalledWith('events')
    })

    it('should return error when event creation fails', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const formData = {
        title: 'Test Event',
        description: 'Test Description',
        date: new Date('2024-12-25'),
        starts_at: '10:00',
        ends_at: '14:00',
        location: 'Test Location',
        image_url: 'test.jpg',
        roles: [{ role_name: 'Volunteer', capacity: 10 }],
      }

      const result = await CreateEvent(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })

    it('should calculate total capacity from roles', async () => {
      let capturedCapacity: number | undefined

      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'events') {
            return {
              insert: vi.fn().mockImplementation((data) => {
                capturedCapacity = data.capacity
                return {
                  select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: { id: 'event-123' },
                      error: null,
                    }),
                  }),
                }
              }),
            }
          }
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          }
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const formData = {
        title: 'Test Event',
        description: 'Test Description',
        date: new Date('2024-12-25'),
        starts_at: '10:00',
        ends_at: '14:00',
        location: 'Test Location',
        image_url: 'test.jpg',
        roles: [
          { role_name: 'Volunteer', capacity: 10 },
          { role_name: 'Coordinator', capacity: 5 },
          { role_name: 'Lead', capacity: 3 },
        ],
      }

      await CreateEvent(formData)

      expect(capturedCapacity).toBe(18) // 10 + 5 + 3
    })
  })

  describe('FetchEvent', () => {
    it('should fetch events successfully', async () => {
      const mockEvents = [
        { id: '1', title: 'Event 1', date: '2024-12-25' },
        { id: '2', title: 'Event 2', date: '2024-12-20' },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockEvents,
              error: null,
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchEvent()

      expect(result.data).toEqual(mockEvents)
      expect(result.error).toBeUndefined()
    })

    it('should return error when fetch fails', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Fetch failed' },
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchEvent()

      expect(result.error).toBe('Fetch failed')
    })
  })

  describe('DeleteEvent', () => {
    it('should delete an event and notify volunteers', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'events') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { title: 'Test Event', image_url: 'test.jpg' },
                    error: null,
                  }),
                }),
              }),
              delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
              }),
            }
          }
          if (table === 'volunteer_requests') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({
                    data: [{ user_id: 'user-1' }, { user_id: 'user-2' }],
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
              update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({ error: null }),
                }),
              }),
            }
          }
          return {}
        }),
        storage: {
          from: vi.fn(() => ({
            remove: vi.fn().mockResolvedValue({ error: null }),
          })),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await DeleteEvent('event-123')

      expect(result.success).toBe(true)
    })

    it('should not delete placeholder image', async () => {
      let imageRemoved = false

      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'events') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { title: 'Test Event', image_url: 'placeholderImage.png' },
                    error: null,
                  }),
                }),
              }),
              delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
              }),
            }
          }
          if (table === 'volunteer_requests') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({ data: [], error: null }),
                }),
              }),
              delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
              }),
            }
          }
          if (table === 'notifications') {
            return {
              update: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({ error: null }),
                }),
              }),
            }
          }
          return {}
        }),
        storage: {
          from: vi.fn(() => ({
            remove: vi.fn().mockImplementation(() => {
              imageRemoved = true
              return Promise.resolve({ error: null })
            }),
          })),
        },
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      await DeleteEvent('event-123')

      expect(imageRemoved).toBe(false)
    })
  })

  describe('FetchEventForEdit', () => {
    it('should fetch event with roles and capacity info', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'events') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'event-123', title: 'Test Event' },
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
                    data: [{ role_id: 'role-1' }, { role_id: 'role-1' }],
                    count: 2,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === 'event_roles') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [{ id: 'role-1', role_name: 'Volunteer', capacity: 10 }],
                  error: null,
                }),
              }),
            }
          }
          return {}
        }),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchEventForEdit('event-123')

      expect(result.data).toBeDefined()
      expect(result.data?.roles).toBeDefined()
    })
  })
})
