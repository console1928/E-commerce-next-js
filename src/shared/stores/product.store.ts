'use client'

import { makeAutoObservable, runInAction } from 'mobx'
import { ProductType, ProductImage } from './products.store';

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL
const API_PRODUCTS = 'api/products'

export interface RelatedProduct {
    id: number;
    title: string;
    price: number;
    productCategory: { title: string };
    description: string;
    images: ProductImage[];
}

class ProductStore {
    product: ProductType | null = null
    relatedItems: RelatedProduct[] = []
    loading: boolean = false
    error: string | null = null

    readonly API_PRODUCTS_URL = `${BASE_API_URL}/${API_PRODUCTS}`

    constructor() {
        makeAutoObservable(this)
    }

    setLoading = (loading: boolean) => {
        this.loading = loading
    }

    setError = (error: string | null) => {
        this.error = error
    }

    fetchProductData = async (id: string, options: { forceRefresh?: boolean } = {}) => {
        if (!id) return

        try {
            runInAction(() => {
                this.loading = true
                this.error = null
            })

            const productFetchOptions: RequestInit = options.forceRefresh 
                ? { cache: 'no-store' }
                : { next: { revalidate: 60 } }

            const productsFetchOptions: RequestInit = { 
                next: { revalidate: 60 }
            }

            const [productResponse, productsResponse] = await Promise.all([
                fetch(`${this.API_PRODUCTS_URL}/${id}?populate[0]=images&populate[1]=productCategory`, productFetchOptions),
                fetch(`${this.API_PRODUCTS_URL}?populate[0]=images&populate[1]=productCategory`, productsFetchOptions),
            ])

            if (!productResponse.ok) {
                throw new Error(`Failed to fetch product: ${productResponse.status}`)
            }

            if (!productsResponse.ok) {
                throw new Error(`Failed to fetch products list: ${productsResponse.status}`)
            }

            const productData = await productResponse.json()
            const allProductsData = await productsResponse.json()

            const product = productData.data
            const allProducts = allProductsData.data

            const related = allProducts
                .filter((item: ProductType) =>
                    item.productCategory?.title === product.productCategory?.title &&
                    item.documentId !== product.documentId
                )
                .slice(0, 3)
                .map((item: ProductType): RelatedProduct => ({
                    id: item.documentId,
                    title: item.title,
                    price: item.price,
                    productCategory: item.productCategory,
                    description: item.description,
                    images: item.images
                }))

            runInAction(() => {
                this.product = product
                this.relatedItems = related
                this.loading = false
            })
        } catch (err) {
            runInAction(() => {
                this.error = err instanceof Error ? err.message : 'Failed to load product data'
                this.loading = false
            })
            console.error('Error fetching product:', err)
        }
    }

    fetchProductDataForce = async (id: string) => {
        return this.fetchProductData(id, { forceRefresh: true })
    }

    clearProduct = () => {
        this.product = null
        this.relatedItems = []
        this.error = null
    }
}

export const productStore = new ProductStore()