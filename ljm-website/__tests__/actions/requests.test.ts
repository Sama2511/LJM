import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/app/utils/server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '@/app/utils/server'
import {
  FetchPendingrequests,
  FetchAcceptedrequests,
  FetchRejectedrequests,
  FetchAllVolunteerRequests,
} from '@/actions/requests'

describe('Requests Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('FetchPendingrequests', () => {
    it('should fetch pending requests successfully', async () => {
      const mockData = [
        { id: '1', status: 'Pending', users: { firstname: 'John' } },
        { id: '2', status: 'Pending', users: { firstname: 'Jane' } },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: mockData,
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchPendingrequests()

      expect(result.data).toEqual(mockData)
    })

    it('should filter by search query', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              or: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: [{ id: '1', users: { firstname: 'John' } }],
                  error: null,
                }),
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchPendingrequests('John')

      expect(result.data).toBeDefined()
    })

    it('should return error on failure', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchPendingrequests()

      expect(result.error).toBe('Database error')
    })
  })

  describe('FetchAcceptedrequests', () => {
    it('should fetch accepted requests successfully', async () => {
      const mockData = [
        { id: '1', status: 'Approved', users: { firstname: 'John' } },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: mockData,
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchAcceptedrequests()

      expect(result.data).toEqual(mockData)
    })
  })

  describe('FetchRejectedrequests', () => {
    it('should fetch rejected requests successfully', async () => {
      const mockData = [
        { id: '1', status: 'Rejected', users: { firstname: 'John' } },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: mockData,
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchRejectedrequests()

      expect(result.data).toEqual(mockData)
    })
  })

  describe('FetchAllVolunteerRequests', () => {
    it('should fetch all volunteer requests', async () => {
      const mockData = [
        { id: '1', status: 'Pending' },
        { id: '2', status: 'Approved' },
        { id: '3', status: 'Rejected' },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockData,
              error: null,
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchAllVolunteerRequests()

      expect(result.data).toEqual(mockData)
      expect(result.data?.length).toBe(3)
    })

    it('should filter by search query', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            or: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [{ id: '1' }],
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchAllVolunteerRequests('search')

      expect(result.data).toBeDefined()
    })
  })
})
