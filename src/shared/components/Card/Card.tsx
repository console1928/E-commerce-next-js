'use client'

import React from 'react'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import classNames from 'classnames'
import Text from '@components/Text'
import Button from '@components/Button'
import { cartStore } from '@stores/cart.store'
import { ProductData, ProductImage, ProductType } from '@stores/products.store'
import styles from './Card.module.scss'

export type CardProps = {
  className?: string
  image: string
  captionSlot?: React.ReactNode
  title: React.ReactNode
  subtitle: React.ReactNode
  contentSlot?: React.ReactNode
  onClick?: React.MouseEventHandler
  actionSlot?: React.ReactNode
  url: string
  productData?: ProductData
}

const Card: React.FC<CardProps> = observer(({
  className,
  image,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  actionSlot,
  onClick,
  url,
  productData
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (productData) {
      const product: {
        documentId: number,
        title: string,
        price: number,
        productCategory: { id: number, title: string },
        description: string,
        images: ProductImage[]
      } = {
        documentId: productData.id,
        title: productData.title,
        price: productData.contentSlot,
        productCategory: { id: productData.categoryId || 0, title: productData.captionSlot },
        description: productData.subTitle,
        images: productData.images
      }
      cartStore.addToCart(product as ProductType)
    }
  }

  const cardClass = classNames(styles.card, className, {
    [styles['card--clickable']]: !!onClick,
  })

  return (
    <div className={cardClass} onClick={onClick}>
      <Link href={url}>
        <div className={styles['card__image-container']}>
          <img
            src={image}
            alt=""
            className={styles.card__image}
            loading="lazy"
          />
        </div>

        <div className={styles.card__content}>
          {captionSlot && (
            <div className={styles.card__caption}>
              {captionSlot}
            </div>
          )}

          <div className={styles.card__text}>
            <Text className={styles.card__title} tag='h3' view='p-20' weight='bold'>{title}</Text>
            <Text className={styles.card__subtitle} tag='p' view='p-16' weight='normal'>{subtitle}</Text>
          </div>

          {(contentSlot || actionSlot) && (
            <div className={styles.card__footer}>
              {contentSlot && (
                <div className={styles['card__content-slot']}>
                  {contentSlot}
                </div>
              )}
              {actionSlot && (
                <div className={styles['card__action-slot']}>
                  <Button onClick={handleAddToCart}>Add to cart</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
})

export default Card