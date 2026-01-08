import type { Meta, StoryObj } from '@storybook/react'
import { http, HttpResponse } from 'msw'
import { Bundles } from './Bundles'

const meta: Meta<typeof Bundles> = {
  title: 'Components/Bundles',
  component: Bundles,
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, iframeHeight: 600 } },
  },
  argTypes: {
    bundleDiscount: {
      control: { type: 'range', min: 0, max: 50, step: 5 },
      description: 'Bundle discount percentage (0-50%)',
    },
    maxProducts: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Maximum number of products to display',
    },
    useWebWorker: {
      control: 'boolean',
      description:
        'Enable Web Worker for price calculations (keeps UI responsive)',
    },
    simulateHeavyWork: {
      control: 'boolean',
      description:
        'Simulate CPU-intensive work (~500ms) to show main thread blocking visually',
    },
    debug: {
      control: 'boolean',
      description: 'Show debug information (calculation time in ms)',
    },
    apiEndpoint: {
      control: 'text',
      description: 'API endpoint to fetch products from',
    },
    onAddToBasket: {
      action: 'onAddToBasket',
      description: 'Callback when add to basket is clicked',
    },
  },
}

export default meta
type Story = StoryObj<typeof Bundles>

const mockProducts = [
  {
    id: 60007741,
    image:
      'https://images.hollandandbarrettimages.co.uk/productimages/HB/320/046901_A.jpg',
    sku: '046701',
    title: 'Holland & Barrett Pure Cod Liver Oil 1000mg 60 Capsules',
    price: '8.99',
    stock: 10,
  },
  {
    id: 6100000106,
    image:
      'https://images.hollandandbarrettimages.co.uk/productimages/HB/320/047306_A.jpg',
    sku: '047306',
    title: 'Holland & Barrett Omega 3 Fish Oil 1000mg 60 Capsules',
    price: '6.99',
    stock: 10,
  },
  {
    id: 6100000246,
    image:
      'https://images.hollandandbarrettimages.co.uk/productimages/HB/320/061513_A.jpg',
    sku: '061513',
    title: 'Holland & Barrett Magnesium 375mg 30 Tablets',
    price: '3.99',
    stock: 100,
  },
  {
    id: 60011168,
    image:
      'https://images.hollandandbarrettimages.co.uk/productimages/HB/320/047337_A.jpg',
    sku: '047337',
    title: 'Holland & Barrett Iron & Vitamin C 14mg 30 Tablets',
    price: '2.99',
    stock: 100,
  },
]

// Default story
export const Default: Story = {
  args: {
    bundleDiscount: 0,
    useWebWorker: false,
    simulateHeavyWork: false,
    debug: false,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('https://hb.demo/products', async () => {
          // simulate slow network: 3 seconds delay
          await new Promise((resolve) => setTimeout(resolve, 3000))
          return HttpResponse.json({ data: { products: mockProducts } })
        }),
      ],
    },
  },
}

// Discount example
export const WithDiscount: Story = {
  args: {
    bundleDiscount: 10,
    debug: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('https://hb.demo/products', () => {
          return HttpResponse.json({ data: { products: mockProducts } })
        }),
      ],
    },
  },
}

// Limited products example
export const LimitedProducts: Story = {
  args: {
    maxProducts: 3,
    bundleDiscount: 5,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('https://hb.demo/products', () => {
          return HttpResponse.json({ data: { products: mockProducts } })
        }),
      ],
    },
  },
}

// Multiple cards from DummyJSON API
export const MultipleProducts: Story = {
  args: {
    apiEndpoint: 'https://dummyjson.com/products',
    bundleDiscount: 10,
    maxProducts: 10,
    useWebWorker: true,
    simulateHeavyWork: false,
    debug: true,
  },
}

// Loading state (slow network)
export const LoadingState: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get('https://hb.demo/products', async () => {
          // simulate slow network: 3 seconds delay
          await new Promise((resolve) => setTimeout(resolve, 3000))
          return HttpResponse.json({ data: { products: mockProducts } })
        }),
      ],
    },
  },
}

// Empty State
export const EmptyState: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get('https://hb.demo/products', () => {
          // No product list
          return HttpResponse.json({ data: { products: [] } })
        }),
      ],
    },
  },
}

// Error State
export const ErrorState: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get('https://hb.demo/products', () => {
          // Simulate server error
          return HttpResponse.error()
        }),
      ],
    },
  },
}

// Playground: Main Thread vs Web Worker + heavy computation
export const Playground: Story = {
  args: {
    bundleDiscount: 15,
    maxProducts: 5,
    useWebWorker: false,
    simulateHeavyWork: false,
    debug: true,
  },
  argTypes: {
    useWebWorker: { control: 'boolean' },
    simulateHeavyWork: { control: 'boolean' },
    bundleDiscount: { control: { type: 'range', min: 0, max: 50, step: 5 } },
    maxProducts: { control: { type: 'number', min: 1, max: 10 } },
  },
  parameters: {
    docs: {
      description: {
        story: `Playground:
    - Toggle Web Worker to see UI remain responsive vs blocking.
    - Toggle Simulate Heavy Work to trigger CPU-intensive computation.
    - Select 1 product → no discount.
    - Select 2+ products → discount applied dynamically.
    - Open browser console to see calculation time logs.
        `,
      },
    },
    msw: {
      handlers: [
        http.get('https://hb.demo/products', () => {
          return HttpResponse.json({ data: { products: mockProducts } })
        }),
      ],
    },
  },
  render: (args) => {
    return <Bundles {...args} />
  },
}

// Out of Stock
export const OutOfStock: Story = {
  args: {
    bundleDiscount: 15,
    debug: true,
  },
  parameters: {
    docs: {
      description: {
        story: `Out of Stock:
          - Products with 0 stock are automatically filtered out and not displayed.
          - In this example, only 2 products have stock available.`,
      },
    },
    msw: {
      handlers: [
        http.get('https://hb.demo/products', () => {
          const products = [
            {
              id: 60007741,
              image:
                'https://images.hollandandbarrettimages.co.uk/productimages/HB/320/046901_A.jpg',
              sku: '046701',
              title: 'Holland & Barrett Pure Cod Liver Oil 1000mg 60 Capsules',
              price: '8.99',
              stock: 0,
            },
            {
              id: 6100000106,
              image:
                'https://images.hollandandbarrettimages.co.uk/productimages/HB/320/047306_A.jpg',
              sku: '047306',
              title: 'Holland & Barrett Omega 3 Fish Oil 1000mg 60 Capsules',
              price: '6.99',
              stock: 20,
            },
            {
              id: 60011168,
              image:
                'https://images.hollandandbarrettimages.co.uk/productimages/HB/320/047337_A.jpg',
              sku: '047337',
              title: 'Holland & Barrett Iron & Vitamin C 14mg 30 Tablets',
              price: '2.99',
              stock: 50,
            },
            {
              id: 6100000246,
              image:
                'https://images.hollandandbarrettimages.co.uk/productimages/HB/320/061513_A.jpg',
              sku: '061513',
              title: 'Holland & Barrett Magnesium 375mg 30 Tablets',
              price: '3.99',
              stock: 0,
            },
          ]

          // Log stock information to console
          console.group('Out of Stock - Product Stock Levels')
          console.log('Total products in API response:', products.length)
          console.table(
            products.map((p) => ({
              SKU: p.sku,
              Title: p.title,
              Stock: p.stock,
              Status: p.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK',
            }))
          )
          console.log(
            'Products that will be displayed:',
            products.filter((p) => p.stock > 0).length
          )
          console.log(
            'Products filtered out (0 stock):',
            products.filter((p) => p.stock === 0).length
          )
          console.groupEnd()

          return HttpResponse.json({
            data: {
              products,
            },
          })
        }),
      ],
    },
  },
}
