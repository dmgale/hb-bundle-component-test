import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Bundles } from './Bundles'

// Mock fetch for testing
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

beforeEach(() => {
  global.fetch = jest.fn()
  console.log = jest.fn()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Bundles Component (Latest Version)', () => {
  it('shows loading state initially', () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {}) // this doesnt resolve
    )
    render(<Bundles />)
    expect(screen.getByText(/Loading products/i)).toBeInTheDocument()
  })

  it('renders only in-stock products', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { products: mockProducts } }),
    })

    render(<Bundles />)

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
      expect(screen.getByText('Product 3')).toBeInTheDocument()
    })

    expect(screen.queryByText('Product 2')).not.toBeInTheDocument()
  })

  it('calculates total price correctly', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { products: mockProducts } }),
    })

    render(<Bundles bundleDiscount={10} />)

    await waitFor(() => {
      expect(screen.getByText(/Total Price:/)).toBeInTheDocument()
    })

    // Total price for Product 1 + Product 3 = 10 + 20 = 30
    expect(screen.getByText(/£30.00/)).toBeInTheDocument()

    // Deselect Product 1
    fireEvent.click(screen.getByLabelText(/Select Product 1/i))
    await waitFor(() => {
      // Only Product 3 selected, discount should not apply
      expect(screen.getByText(/£20.00/)).toBeInTheDocument()
    })

    // Deselect all
    fireEvent.click(screen.getByLabelText(/Select Product 3/i))
    await waitFor(() => {
      expect(screen.getByText(/£0.00/)).toBeInTheDocument()
    })
  })

  it('updates button text based on selected products', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { products: mockProducts } }),
    })

    render(<Bundles />)

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent(
        'Add 2 items to basket'
      )
    })

    // Deselect Product 1
    fireEvent.click(screen.getByLabelText(/Select Product 1/i))
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent(
        'Add 1 item to basket'
      )
    })

    // Deselect Product 3
    fireEvent.click(screen.getByLabelText(/Select Product 3/i))
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent(
        'Select items to add'
      )
    })
  })

  it('logs selected SKUs when button is clicked', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { products: mockProducts } }),
    })

    render(<Bundles />)

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button'))
    expect(console.log).toHaveBeenCalledWith(
      'Adding:',
      expect.arrayContaining(['SKU001', 'SKU003'])
    )
  })

  it('shows error state if API fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    render(<Bundles />)

    await waitFor(() => {
      expect(screen.getByText(/Unable to load products/i)).toBeInTheDocument()
      expect(screen.getByText(/Network error/i)).toBeInTheDocument()
    })
  })

  it('displays empty state when no products available', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { products: [] } }),
    })

    render(<Bundles />)

    await waitFor(() => {
      expect(screen.getByText(/No products available/i)).toBeInTheDocument()
    })
  })

  it('disables button when no products are selected', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { products: mockProducts } }),
    })

    render(<Bundles />)

    await waitFor(() => {
      const button = screen.getByRole('button')
      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach((checkbox) => fireEvent.click(checkbox))
      expect(button).toBeDisabled()
    })
  })

  it('checkboxes have accessible labels', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { products: mockProducts } }),
    })

    render(<Bundles />)

    await waitFor(() => {
      expect(screen.getByLabelText(/Select Product 1/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Select Product 3/i)).toBeInTheDocument()
    })
  })
})
