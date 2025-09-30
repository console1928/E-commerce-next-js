import React from 'react';
import Card from '@components/Card';
import Button from '@components/Button';
import Text from '@components/Text';
import Pagination from '@components/Pagination';
import { CategoryOption, ProductData } from '@stores/products.store';
import styles from './Products.module.scss';

interface ProductsContentProps {
    isLoading: boolean;
    error: string | null;
    filteredProducts: ProductData[];
    paginatedProducts: ProductData[];
    totalPages: number;
    totalProducts: number;
    searchValue: string;
    selectedFilters: CategoryOption[];
    currentPage: number;
    onPageChange: (pageNumber: number) => void;
    onRetry: () => void;
}

const ProductsContent: React.FC<ProductsContentProps> = ({
    isLoading,
    error,
    filteredProducts,
    paginatedProducts,
    totalPages,
    totalProducts,
    searchValue,
    selectedFilters,
    currentPage,
    onPageChange,
    onRetry
}) => {
    if (isLoading) {
        return (
            <div className={styles.products}>
                <div className={styles.loading}>
                    <Text view="p-20" color="secondary">Loading products...</Text>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.products}>
                <div className={styles.error}>
                    <Text view="p-20" color="secondary">{error}</Text>
                    <Button onClick={onRetry}>Try Again</Button>
                </div>
            </div>
        );
    }

    if (filteredProducts.length === 0) {
        return (
            <div className={styles.products}>
                <div className={styles.noResults}>
                    <Text view="p-20" color="secondary">
                        {searchValue || selectedFilters.length > 0
                            ? 'No products found matching your criteria'
                            : 'No products available'
                        }
                    </Text>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.products}>
            <div className={styles.total}>
                <Text view="p-20" weight="bold">
                    Total Products
                </Text>
                <Text view="p-20" weight="bold" color="accent">
                    {totalProducts}
                </Text>
            </div>

            <div className={styles.items}>
                {paginatedProducts.map((product) => (
                    <Card
                        url={`/product/${product.id}`}
                        className={styles.item}
                        key={product.id}
                        title={product.title}
                        image={product.images[0]?.formats?.large?.url || product.images[0]?.url || '/placeholder-image.jpg'}
                        subtitle={product.subTitle}
                        captionSlot={product.captionSlot}
                        contentSlot={`$${product.contentSlot}`}
                        actionSlot={<Button>Add to cart</Button>}
                        productData={product}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <Pagination
                        productsPerPage={9}
                        totalProducts={totalProducts}
                        paginate={onPageChange}
                        currentPage={currentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductsContent;