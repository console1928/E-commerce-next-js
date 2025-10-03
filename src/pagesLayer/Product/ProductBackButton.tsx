'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import ArrowRightIcon from '@components/icons/ArrowRightIcon'
import styles from './Product.module.scss'

const ProductBackButton: React.FC = () => {
  const router = useRouter()

  return (
    <div className={styles.backBtn} onClick={() => router.back()}>
      <div className={styles.icon}>
        <ArrowRightIcon
          className={styles.backIcon}
          width={32}
          height={32}
          viewBox="0 0 24 24"
          color="primary"
        />
      </div>
      <div className={styles.text}>Назад</div>
    </div>
  )
}

export default ProductBackButton