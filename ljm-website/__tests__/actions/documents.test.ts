import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/app/utils/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { createClient } from '@/app/utils/server'
import {
  CreateDocument,
  FetchDocuments,
  DeleteDocument,
} from '@/actions/documents'

describe('Documents Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('CreateDocument', () => {
    it('should create document successfully', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn().mockResolvedValue({ error: null }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await CreateDocument('Annual Report', 'report.pdf')

      expect(result.success).toBe(true)
    })

    it('should return error on failure', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn().mockResolvedValue({
            error: { message: 'Insert failed' },
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await CreateDocument('Annual Report', 'report.pdf')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insert failed')
    })
  })

  describe('FetchDocuments', () => {
    it('should fetch all documents', async () => {
      const mockDocuments = [
        { id: '1', title: 'Document 1', file_url: 'doc1.pdf' },
        { id: '2', title: 'Document 2', file_url: 'doc2.pdf' },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockDocuments,
              error: null,
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchDocuments()

      expect(result.data).toEqual(mockDocuments)
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

      const result = await FetchDocuments()

      expect(result.error).toBe('Fetch failed')
    })
  })

  describe('DeleteDocument', () => {
    it('should delete document and its file from storage', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'documents') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { file_url: 'document.pdf' },
                    error: null,
                  }),
                }),
              }),
              delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
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

      const result = await DeleteDocument('doc-1')

      expect(result.success).toBe(true)
    })

    it('should delete document without file in storage', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'documents') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { file_url: null },
                    error: null,
                  }),
                }),
              }),
              delete: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
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

      const result = await DeleteDocument('doc-1')

      expect(result.success).toBe(true)
    })

    it('should return error on failure', async () => {
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
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: { message: 'Delete failed' },
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await DeleteDocument('doc-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Delete failed')
    })
  })
})
