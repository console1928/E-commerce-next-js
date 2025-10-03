'use client'

import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { productsStore } from '@stores/products.store'
import ProductsHeader from '@pagesLayer/Products/ProductsHeader'
import ProductsSearch from '@pagesLayer/Products/ProductsSearch'
import ProductsContent from '@pagesLayer/Products/ProductsContent'
import styles from '@pagesLayer/Products/Products.module.scss'

const ProductsPage = observer(() => {
  const searchParams = useSearchParams()
  
  const {
    searchValue,
    currentPage,
    isLoading,
    isSearching,
    isFiltering,
    error,
    selectedFilters,
    categories,
    categoryOptions,
    filteredProducts,
    paginatedProducts,
    totalPages,
    totalProducts,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleSearchChange,
    handleRetry,
    initialize
  } = productsStore

  useEffect(() => {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    initialize(params)
  }, [searchParams])

  return (
    <div className={`${styles.productsWrapper} wrapper`}>
      <ProductsHeader />
      
      <ProductsSearch
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        categoryOptions={categoryOptions}
        isLoading={isLoading}
        isSearching={isSearching}
        isFiltering={isFiltering}
        categories={categories}
      />

      <ProductsContent
        isLoading={isLoading}
        error={error}
        filteredProducts={filteredProducts}
        paginatedProducts={paginatedProducts}
        totalPages={totalPages}
        totalProducts={totalProducts}
        searchValue={searchValue}
        selectedFilters={selectedFilters}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onRetry={handleRetry}
      />
    </div>
  )
})

export default ProductsPage