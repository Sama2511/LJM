import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/app/utils/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { createClient } from '@/app/utils/server'
import {
  CreateArticle,
  FetchArticles,
  FetchArticleById,
  UpdateArticle,
  DeleteArticle,
} from '@/actions/articles'

describe('Articles Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('CreateArticle', () => {
    it('should create article successfully', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn().mockResolvedValue({ error: null }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const formData = {
        title: 'Test Article',
        content: 'This is test content for the article.',
        image_url: 'test.jpg',
      }

      const result = await CreateArticle(formData)

      expect(result.success).toBe(true)
    })

    it('should create article without image', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn().mockResolvedValue({ error: null }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const formData = {
        title: 'Test Article',
        content: 'This is test content for the article.',
      }

      const result = await CreateArticle(formData)

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

      const formData = {
        title: 'Test Article',
        content: 'This is test content.',
      }

      const result = await CreateArticle(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insert failed')
    })
  })

  describe('FetchArticles', () => {
    it('should fetch all articles', async () => {
      const mockArticles = [
        { id: '1', title: 'Article 1', content: 'Content 1' },
        { id: '2', title: 'Article 2', content: 'Content 2' },
      ]

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockArticles,
              error: null,
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchArticles()

      expect(result.data).toEqual(mockArticles)
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

      const result = await FetchArticles()

      expect(result.error).toBe('Fetch failed')
    })
  })

  describe('FetchArticleById', () => {
    it('should fetch single article by id', async () => {
      const mockArticle = { id: '1', title: 'Article 1', content: 'Content 1' }

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockArticle,
                error: null,
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchArticleById('1')

      expect(result.data).toEqual(mockArticle)
    })

    it('should return error when article not found', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Article not found' },
              }),
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const result = await FetchArticleById('invalid-id')

      expect(result.error).toBe('Article not found')
    })
  })

  describe('UpdateArticle', () => {
    it('should update article successfully', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const formData = {
        title: 'Updated Article',
        content: 'Updated content for the article.',
        image_url: 'updated.jpg',
      }

      const result = await UpdateArticle('article-1', formData)

      expect(result.success).toBe(true)
    })

    it('should return error on failure', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: { message: 'Update failed' },
            }),
          }),
        })),
      }

      vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

      const formData = {
        title: 'Updated Article',
        content: 'Updated content.',
      }

      const result = await UpdateArticle('article-1', formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Update failed')
    })
  })

  describe('DeleteArticle', () => {
    it('should delete article and its image', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'articles') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { image_url: 'article-image.jpg' },
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

      const result = await DeleteArticle('article-1')

      expect(result.success).toBe(true)
    })

    it('should delete article without image', async () => {
      const mockSupabase = {
        from: vi.fn((table: string) => {
          if (table === 'articles') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { image_url: null },
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

      const result = await DeleteArticle('article-1')

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

      const result = await DeleteArticle('article-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Delete failed')
    })
  })
})
