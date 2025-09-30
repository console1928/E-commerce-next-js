'use client'

import { productsStore } from './products.store'
import { productStore } from './product.store'
import { cartStore } from './cart.store'

export class RootStore {
  productsStore = productsStore
  productStore = productStore
  cartStore = cartStore
}

export const rootStore = new RootStore()