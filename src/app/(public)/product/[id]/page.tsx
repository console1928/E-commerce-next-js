'use client'

import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { productStore } from '@stores/product.store'
import ProductBackButton from '@components/Pages/Product/ProductBackButton'
import ProductMain from '@components/Pages/Product/ProductMain'
import ProductRelated from '@components/Pages/Product/ProductRelated'
import ProductLoading from '@components/Pages/Product/ProductLoading'
import ProductError from '@components/Pages/Product/ProductError'
import ProductNotFound from '@components/Pages/Product/ProductNotFound'

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