import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Simple component for testing
function HelloWorld({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}

describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should render a React component', () => {
    render(<HelloWorld name="Vitest" />)
    expect(screen.getByText('Hello, Vitest!')).toBeDefined()
  })
})
