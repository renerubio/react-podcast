'use client'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import SearchInput from './SearchInput'

describe('components/ui/SearchInput', () => {
  it('renders an input with the translated placeholder', () => {
    render(<SearchInput value="" onChange={() => {}} />)
    expect(screen.getByRole('textbox', { name: /filter/i })).toBeInTheDocument()
  })
})
