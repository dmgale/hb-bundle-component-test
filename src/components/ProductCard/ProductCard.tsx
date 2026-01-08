import React from 'react'
import styles from './ProductCard.module.css'

export interface Product {
  id: number
  image: string
  sku: string
  title: string
  price: string
  stock: number
}

export interface ProductCardProps {
  product: Product
  isSelected: boolean
  onToggle: (sku: string) => void
  showSeparator?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onToggle,
  showSeparator = false,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/hb-placeholder.svg'
  }

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isSelected}
            onChange={() => onToggle(product.sku)}
            aria-label={`Select ${product.title}`}
          />
        </div>
        <div className={styles.imageWrapper}>
          <img
            src={product.image || '/hb-placeholder.svg'}
            alt={product.title}
            className={styles.image}
            onError={handleImageError}
          />
        </div>
        <div>
          <h3 className={styles.productTitle}>{product.title}</h3>
          <p className={styles.price}>£{product.price}</p>
        </div>
      </div>
      {showSeparator && (
        <div className={styles.separator} aria-hidden="true">
          ﹢
        </div>
      )}
    </div>
  )
}
