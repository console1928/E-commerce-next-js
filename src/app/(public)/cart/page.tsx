'use client'

import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import Text from '@components/Text'
import Button from '@components/Button'
import { cartStore } from '@stores/cart.store'
import styles from '@pagesLayer/Cart/Cart.module.scss'

const CartPage = observer(() => {
  const { items, totalPrice, totalItems, updateQuantity, removeFromCart, clearCart } = cartStore

  if (items.length === 0) {
    return (
      <div className={`${styles.cart} wrapper`}>
        <div className={styles.cart__empty}>
          <Text view="title" color="primary">Your cart is empty</Text>
          <Text view="p-20" color="secondary">Add some products to get started</Text>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.cart} wrapper`}>
      <div className={styles.cart__header}>
        <Text view="title" color="primary">Shopping Cart</Text>
        <Button onClick={clearCart}>Clear Cart</Button>
      </div>

      <div className={styles.cart__content}>
        <div className={styles.cart__items}>
          {items.map((item) => (
            <div key={item.product.documentId} className={styles.cart__item}>
              <img
                src={item.product.images[0]?.formats?.thumbnail?.url || item.product.images[0]?.url || '/placeholder-image.jpg'}
                alt={item.product.title}
                className={styles['cart-item__image']}
              />

              <div className={styles['cart-item__info']}>
                <Link href={`/product/${item.product.documentId}`} className={styles['cart-item__title']}>
                  <Text view="p-20" weight="bold">{item.product.title}</Text>
                </Link>
                <Text view="p-16" color="secondary">{item.product.productCategory.title}</Text>
                <Text view="p-20" weight="bold" color="accent">${item.product.price}</Text>
              </div>

              <div className={styles['cart-item__controls']}>
                <div className={styles['quantity-controls']}>
                  <Button
                    onClick={() => updateQuantity(item.product.documentId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <span className={styles['quantity-controls__quantity']}>{item.quantity}</span>
                  <Button
                    onClick={() => updateQuantity(item.product.documentId, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>

                <Button onClick={() => removeFromCart(item.product.documentId)}>
                  Remove
                </Button>
              </div>

              <div className={styles['cart-item__total']}>
                <Text view="p-20" weight="bold">${(item.product.price * item.quantity).toFixed(2)}</Text>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cart__summary}>
          <div className={styles['summary-card']}>
            <Text view="p-20" weight="bold">Order Summary</Text>

            <div className={styles['summary-card__row']}>
              <Text view="p-16">Items ({totalItems})</Text>
              <Text view="p-16">${totalPrice.toFixed(2)}</Text>
            </div>

            <div className={styles['summary-card__row']}>
              <Text view="p-16">Shipping</Text>
              <Text view="p-16">Free</Text>
            </div>

            <div className={styles['summary-card__divider']} />

            <div className={styles['summary-card__row']}>
              <Text view="p-20" weight="bold">Total</Text>
              <Text view="p-20" weight="bold" color="accent">${totalPrice.toFixed(2)}</Text>
            </div>

            <Button className={styles['summary-card__checkout-button']}>
              Proceed to Checkout
            </Button>

            <Link href="/" className={styles['summary-card__continue-shopping']}>
              <Text view="p-16" color="secondary">Continue Shopping</Text>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CartPage