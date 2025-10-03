'use client'

import React from 'react';
import { observer } from 'mobx-react-lite';
import Text from '@components/Text';
import Button from '@components/Button';
import { ProductType } from '@stores/products.store';
import { cartStore } from '@stores/cart.store';
import styles from './Product.module.scss';

interface ProductMainProps {
    product: ProductType;
}

const ProductMain: React.FC<ProductMainProps> = observer(({ product }) => {
    const handleAddToCart = () => {
        cartStore.addToCart(product);
    };

    const handleBuyNow = () => {
        cartStore.addToCart(product);
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img
                    className={styles.image}
                    src={product.images[0].formats?.large?.url || '/placeholder-image.jpg'}
                    alt={product.title}
                    loading="lazy"
                />
            </div>

            <div className={styles.content}>
                <div className={styles.contentText}>
                    <Text className={styles.contentTitle}>
                        {product.title}
                    </Text>
                    <Text className={styles.contentSubtitle} color="secondary">
                        {product.description}
                    </Text>
                </div>

                <div className={styles.actionContainer}>
                    <span className={styles.price}>{`$${product.price}`}</span>
                    <div className={styles.btns}>
                        <Button className={styles.buyBtn} onClick={handleBuyNow}>
                            Buy Now
                        </Button>
                        <Button className={styles.addBtn} onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProductMain;