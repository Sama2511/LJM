import { vi } from 'vitest'

// Mock Supabase client builder
export function createMockSupabaseClient(overrides: any = {}) {
  const mockFrom = vi.fn((table: string) => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    ...overrides[table],
  }))

  const mockAuth = {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: null, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    ...overrides.auth,
  }

  const mockStorage = {
    from: vi.fn(() => ({
      remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      upload: vi.fn().mockResolvedValue({ data: null, error: null }),
      ...overrides.storage,
    })),
  }

  return {
    from: mockFrom,
    auth: mockAuth,
    storage: mockStorage,
  }
}

// Helper to create chainable mock responses
export function createChainableMock(finalResponse: any) {
  const chain: any = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(finalResponse),
  }

  // Make the chain itself resolve to the final response
  Object.keys(chain).forEach(key => {
    if (key !== 'single') {
      chain[key].mockImplementation(() => ({
        ...chain,
        then: (resolve: any) => resolve(finalResponse),
      }))
    }
  })

  return chain
}
