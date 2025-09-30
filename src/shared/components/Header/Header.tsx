'use client'

import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LalasiaLogoIcon from '@components/icons/LalasiaLogoIcon'
import LalasiaTextIcon from '@components/icons/LalasiaTextIcon'
import BagIcon from '@components/icons/BagIcon'
import UserIcon from '@components/icons/UserIcon'
import { cartStore } from '@stores/cart.store'
import styles from './Header.module.scss'

const Header = observer(() => {
  const { totalItems } = cartStore
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className="wrapper">
        <div className={styles.header__wrapper}>
          <div className={styles.header__logo}>
            <LalasiaLogoIcon className={styles['header__logo-icon']} width={42} height={42} />
            <LalasiaTextIcon className={styles['header__logo-text']} width={80} height={21} />
          </div>
          <nav className={styles.header__menu}>
            <ul className={styles['header__menu-list']}>
              <li className={`${styles['header__menu-item']} ${pathname === '/' ? styles['header__menu-item--active'] : ''}`}>
                <Link href="/">Products</Link>
              </li>
              <li className={`${styles['header__menu-item']} ${pathname === '/categories' ? styles['header__menu-item--active'] : ''}`}>
                <Link href="/categories">Categories</Link>
              </li>
              <li className={`${styles['header__menu-item']} ${pathname === '/about-us' ? styles['header__menu-item--active'] : ''}`}>
                <Link href="/about-us">About us</Link>
              </li>
            </ul>
          </nav>
          <nav className={styles.header__icons}>
            <Link href="/cart" className={styles['header__cart-link']}>
              {totalItems > 0 && (
                <span className={styles['header__cart-badge']}>{totalItems}</span>
              )}
              <BagIcon className={styles['header__icons-bag']} />
            </Link>
            <UserIcon className={styles['header__icons-user']} />
          </nav>
        </div>
      </div>
    </header>
  )
})

export default Header