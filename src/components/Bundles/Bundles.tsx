import { move, spawn } from 'multithreading'
import React, { Suspense, useEffect, useState } from 'react'
import { fetchAndAdaptProducts } from '../../adapters/apiAdapters'
import { Button } from '../Button'
import { ProductCard, type Product } from '../ProductCard'
import styles from './Bundles.module.css'

interface ProductsResponse {
  data: {
    products: Product[]
  }
}

interface BundlesProps {
  apiEndpoint?: string
  bundleDiscount?: number
  maxProducts?: number
  useWebWorker?: boolean
  simulateHeavyWork?: boolean
  onAddToBasket?: (skus: string[]) => void
  debug?: boolean
}

function heavyComputation(): number {
  let result = 0
  for (let i = 0; i < 50_000_000; i++) {
    result += Math.sqrt(i) * Math.random()
  }
  return result
}

async function calculatePriceInWorker(
  prices: number[],
  discount: number,
  simulateHeavy: boolean
): Promise<number> {
  const handle = spawn(
    move(prices, discount, simulateHeavy),
    (priceArray, discountPercent, shouldSimulate) => {
      if (shouldSimulate) {
        let heavyResult = 0
        for (let i = 0; i < 50_000_000; i++) {
          heavyResult += Math.sqrt(i) * Math.random()
        }
      }

      const subtotal = priceArray.reduce((sum, price) => sum + price, 0)
      const discountAmount = subtotal * (discountPercent / 100)
      const total = subtotal - discountAmount

      return parseFloat(total.toFixed(2))
    }
  )

  const result = await handle.join()
  if (result.ok) return result.value
  console.error('Worker error:', result.error)
  return 0
}

function calculatePriceOnMainThread(
  prices: number[],
  discount: number,
  simulateHeavy: boolean
): number {
  if (simulateHeavy) heavyComputation()
  const subtotal = prices.reduce((sum, price) => sum + price, 0)
  const discountAmount = subtotal * (discount / 100)
  const total = subtotal - discountAmount
  return parseFloat(total.toFixed(2))
}

const BundlesContent: React.FC<BundlesProps> = ({
  apiEndpoint = 'https://hb.demo/products',
  bundleDiscount = 0,
  maxProducts,
  useWebWorker = false,
  simulateHeavyWork = false,
  onAddToBasket,
  debug = false,
}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [savings, setSavings] = useState<number>(0)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const allProducts = await fetchAndAdaptProducts(apiEndpoint)
        let inStockProducts = allProducts.filter((p) => p.stock > 0)
        if (maxProducts) inStockProducts = inStockProducts.slice(0, maxProducts)
        setProducts(inStockProducts)
        setSelectedSkus(new Set(inStockProducts.map((p) => p.sku)))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [apiEndpoint, maxProducts])

  useEffect(() => {
    const calculateTotal = async () => {
      if (products.length === 0) return

      const selectedProducts = products.filter((p) => selectedSkus.has(p.sku))
      if (selectedProducts.length === 0) {
        setTotalPrice(0)
        setSavings(0)
        return
      }

      const prices = selectedProducts.map((p) => parseFloat(p.price))
      const applicableDiscount =
        selectedProducts.length > 1 ? bundleDiscount : 0

      setIsCalculating(true)
      const start = performance.now()

      let total: number
      if (useWebWorker) {
        total = await calculatePriceInWorker(
          prices,
          applicableDiscount,
          simulateHeavyWork
        )
      } else {
        total = calculatePriceOnMainThread(
          prices,
          applicableDiscount,
          simulateHeavyWork
        )
      }

      const subtotal = prices.reduce((sum, p) => sum + p, 0)
      setTotalPrice(total)
      setSavings(subtotal - total)

      setIsCalculating(false)

      if (debug) {
        console.log(
          `Calculation completed in ${Math.round(performance.now() - start)} ms`
        )
      }
    }

    calculateTotal()
  }, [products, selectedSkus, bundleDiscount, useWebWorker, simulateHeavyWork])

  const handleToggleProduct = (sku: string) => {
    setSelectedSkus((prev) => {
      const newSet = new Set(prev)
      newSet.has(sku) ? newSet.delete(sku) : newSet.add(sku)
      return newSet
    })
  }

  const handleAddToBasket = () => {
    const selected = products
      .filter((p) => selectedSkus.has(p.sku))
      .map((p) => p.sku)
    onAddToBasket?.(selected)
  }

  const selectedCount = selectedSkus.size
  const buttonText =
    selectedCount === 0
      ? 'Select items to add'
      : `Add ${selectedCount} ${
          selectedCount === 1 ? 'item' : 'items'
        } to basket`

  if (isLoading)
    return <div className={styles.loading}>Loading products...</div>
  if (error)
    return (
      <div className={styles.error}>
        <p>Unable to load products.</p>
        <p>{error}</p>
      </div>
    )
  if (products.length === 0)
    return (
      <div className={styles.empty}>No products available at this time.</div>
    )

  const productsSection = (
    <div className={styles.products}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedSkus.has(product.sku)}
          onToggle={handleToggleProduct}
          showSeparator={index < products.length - 1}
        />
      ))}
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Frequently bought together</h2>
        <p className={styles.disclaimer}>
          Please ensure you read the label of all products purchased as part of
          this bundle before use.
        </p>

        <div className={styles.productsMobile}>{productsSection}</div>

        {isCalculating && <p style={{ color: 'orange' }}>Calculating…</p>}

        <div className={styles.discountContainer}>
          {bundleDiscount > 0 && selectedSkus.size > 1 && (
            <>
              <span className={styles.discountBadge}>
                You save £{savings.toFixed(2)}
              </span>
              <span className={styles.discountPercent}>
                {bundleDiscount}% OFF
              </span>
            </>
          )}
        </div>

        <p className={styles.total}>Total Price: £{totalPrice.toFixed(2)}</p>

        <Button onClick={handleAddToBasket} disabled={selectedCount === 0}>
          {buttonText}
        </Button>
      </div>

      <div className={styles.productsDesktop}>{productsSection}</div>
    </div>
  )
}

export const Bundles: React.FC<BundlesProps> = (props) => (
  <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
    <BundlesContent {...props} />
  </Suspense>
)

export type { BundlesProps, Product, ProductsResponse }
