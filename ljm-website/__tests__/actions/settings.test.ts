import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/app/utils/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { createClient } from '@/app/utils/server'
import {
  FetchSettings,
  FetchSettingByKey,
  UpdateSettings,
} from '@/actions/settings'

describe('Settings Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('FetchSettings', () => {
    it('should fetch all settings', async () => {
      const mockSettings = [
        { id: '1', setting_key: 'site_name', setting_value: 'LJM' },
        { id: '2', setting_key: 'contact_email', setting_value: 'test@ljm.org' },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockSettings,
              error: null,
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchSettings()

      expect(result.data).toEqual(mockSettings)
    })

    it('should return error on failure', async () => {
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

      const result = await FetchSettings()

      expect(result.error).toBe('Fetch failed')
    })
  })

  describe('FetchSettingByKey', () => {
    it('should fetch setting by key', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { setting_value: 'test@ljm.org' },
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchSettingByKey('contact_email')

      expect(result).toBe('test@ljm.org')
    })

    it('should return null when setting not found', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' },
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchSettingByKey('nonexistent_key')

      expect(result).toBeNull()
    })
  })

  describe('UpdateSettings', () => {
    it('should update multiple settings successfully', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const settings = [
        { key: 'site_name', value: 'New Site Name' },
        { key: 'contact_email', value: 'new@ljm.org' },
      ]

      const result = await UpdateSettings(settings)

      expect(result.success).toBe(true)
    })

    it('should return error if any setting update fails', async () => {
      let callCount = 0
      const mockSupabase = {
        from: vi.fn(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockImplementation(() => {
              callCount++
              if (callCount === 2) {
                return Promise.resolve({
                  error: { message: 'Update failed for second setting' },
                })
              }
              return Promise.resolve({ error: null })
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const settings = [
        { key: 'site_name', value: 'New Site Name' },
        { key: 'contact_email', value: 'new@ljm.org' },
      ]

      const result = await UpdateSettings(settings)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Update failed for second setting')
    })

    it('should handle empty settings array', async () => {
      const mockSupabase = {
        from: vi.fn(),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await UpdateSettings([])

      expect(result.success).toBe(true)
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })
  })
})
