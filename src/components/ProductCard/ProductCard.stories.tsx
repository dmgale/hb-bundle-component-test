import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useState } from 'react'
import type { Product } from './ProductCard'
import { ProductCard } from './ProductCard'

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'hnb-teal',
      values: [
        { name: 'hnb-teal', value: '#eef5f4' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    isSelected: {
      control: 'boolean',
      description: 'Whether the product is selected',
    },
    showSeparator: {
      control: 'boolean',
      description: 'Whether to show the plus separator',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// -------------------- Sample Products --------------------
const sampleProduct: Product = {
  id: 60007741,
  image:
    'https://images.hollandandbarrettimages.co.uk/productimages/HB/320/046901_A.jpg',
  sku: '046701',
  title: 'Holland & Barrett Pure Cod Liver Oil 1000mg 60 Capsules',
  price: '8.99',
  stock: 10,
}

// -------------------- Wrapper Component --------------------
const ProductCardWithState = (args: any) => {
  const [isSelected, setIsSelected] = useState(args.isSelected)
  return (
    <ProductCard
      {...args}
      isSelected={isSelected}
      onToggle={() => setIsSelected(!isSelected)}
    />
  )
}

// -------------------- STORIES --------------------
export const Default: Story = {
  args: {
    product: sampleProduct,
    isSelected: false,
    showSeparator: false,
  },
  render: (args) => <ProductCardWithState {...args} />,
}

export const Selected: Story = {
  args: {
    product: sampleProduct,
    isSelected: true,
    showSeparator: false,
  },
  render: (args) => <ProductCardWithState {...args} />,
}

export const WithPlaceholder: Story = {
  args: {
    product: {
      id: 999,
      sku: 'NO-IMAGE-SKU',
      title: '"This product image is not available"',
      price: '9.99',
      image: 'https://broken-url.example.com/image.jpg',
      stock: 10,
    },
    isSelected: false,
    showSeparator: false,
  },
  render: (args) => <ProductCardWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the fallback placeholder image when the product image URL is broken or unavailable.',
      },
    },
  },
}

// -------------------- MultipleCards from JSON --------------------
export const MultipleCards: Story = {
  render: () => {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
      fetch('/mock-hb-products.json')
        .then((res) => res.json())
        .then((data) => setProducts(data.products.slice(0, 3))) // Show 3 only
        .catch((err) => console.error('Failed to load products:', err))
    }, [])

    return (
      <div
        style={{
          display: 'flex',
          gap: '40px',
          padding: '20px',
          flexWrap: 'wrap',
        }}
      >
        {products.map((product, idx) => (
          <ProductCardWithState
            key={product.id}
            product={product}
            isSelected={idx === 1}
            showSeparator={idx < products.length - 1}
          />
        ))}
      </div>
    )
  },
}
