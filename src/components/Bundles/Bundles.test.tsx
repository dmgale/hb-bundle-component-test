import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Bundles } from './Bundles'

// Mock products for testing
const mockProducts = [
  {
    id: 1,
    image: 'https://example.com/product1.jpg',
    sku: 'SKU001',
    title: 'Product 1',
    price: '10.00',
    stock: 5,
  },
  {
    id: 2,
    image: 'https://example.com/product2.jpg',
    sku: 'SKU002',
    title: 'Product 2',
    price: '15.00',
    stock: 0, // Out of stock
  },
  {
    id: 3,
    image: 'https://example.com/product3.jpg',
    sku: 'SKU003',
    title: 'Product 3',
    price: '20.00',
    stock: 10,
  },
]

describe('Bundles Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('shows loading state initially', () => {
    ;(global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )
    render(<Bundles />)
    expect(screen.getByText(/Loading products/i)).toBeInTheDocument()
  })

  it('renders only in-stock products', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { products: mockProducts } }),
    })

    render(<Bundles />)

    await waitFor(() => {
      expect(screen.getAllByText('Product 1').length).toBeGreaterThan(0)
    })

    expect(screen.getAllByText('Product 3').length).toBeGreaterThan(0)
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument()
  })

  it('calculates total price correctly with discount', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { products: mockProducts } }),
    })

    render(<Bundles bundleDiscount={10} />)

    await waitFor(() => {
      expect(screen.getByText(/Total Price:/)).toBeInTheDocument()
    })

    // Total for Product 1 (£10) + Product 3 (£20) = £30
    // With 10% bundle discount = £27.00
    await waitFor(() => {
      const totalText = screen.getByText(/Total Price:/i).textContent
      expect(totalText).toContain('27.00')
    })
  })

  it('updates button text based on selected products', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { products: mockProducts } }),
    })

    render(<Bundles />)

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Add 2 items to basket')
    })

    // Deselect Product 1 - use getAllByLabelText since mobile/desktop views render it twice
    const checkboxes = screen.getAllByLabelText(/Select Product 1/i)
    fireEvent.click(checkboxes[0])

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Add 1 item to basket')
    })
  })

  it('shows error state if API fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<Bundles />)

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('displays empty state when no products available', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { products: [] } }),
    })

    render(<Bundles />)

    await waitFor(() => {
      expect(screen.getByText(/No products available/i)).toBeInTheDocument()
    })
  })

  it('disables button when no products are selected', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: { products: mockProducts } }),
    })

    render(<Bundles />)

    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    // Deselect all products - click only the unique checkboxes (2 products)
    const checkboxes = screen.getAllByRole('checkbox')
    // Click first 2 unique checkboxes to deselect Product 1 and Product 3
    fireEvent.click(checkboxes[0])
    fireEvent.click(checkboxes[1])

    await waitFor(() => {
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    }, { timeout: 3000 })
  })
})
