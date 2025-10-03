'use client'

import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { productStore } from '@stores/product.store'
import ProductBackButton from '@pagesLayer/Product/ProductBackButton'
import ProductMain from '@pagesLayer/Product/ProductMain'
import ProductRelated from '@pagesLayer/Product/ProductRelated'
import ProductLoading from '@pagesLayer/Product/ProductLoading'
import ProductError from '@pagesLayer/Product/ProductError'
import ProductNotFound from '@pagesLayer/Product/ProductNotFound'

const ProductPage = observer(() => {
  const params = useParams()
  const id = params.id as string
  
  const { product, relatedItems, loading, error, fetchProductData } = productStore

  useEffect(() => {
    if (id) {
      fetchProductData(id)
    }
  }, [id])

  const handleRetry = () => {
    if (id) {
      fetchProductData(id)
    }
  }

  if (loading) {
    return <ProductLoading />
  }

  if (error) {
    return <ProductError error={error} onRetry={handleRetry} />
  }

  if (!product) {
    return <ProductNotFound />
  }

  return (
    <div className="product-wrapper wrapper">
      <ProductBackButton />
      
      <div className="product-container">
        <ProductMain product={product} />
        
        {relatedItems.length > 0 && (
          <ProductRelated relatedItems={relatedItems} />
        )}
      </div>
    </div>
  )
})

export default ProductPage