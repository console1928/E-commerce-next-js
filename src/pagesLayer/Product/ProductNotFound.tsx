import React from 'react';
import Link from 'next/link';
import Text from '@components/Text';
import Button from '@components/Button';
import styles from './Product.module.scss';

const ProductNotFound: React.FC = () => {
    return (
        <div className={styles.notFound}>
            <Text view="title">Product not found</Text>
            <Link href="/">
                <Button>Go to Home</Button>
            </Link>
        </div>
    );
};

export default ProductNotFound;