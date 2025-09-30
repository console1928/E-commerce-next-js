'use client'

import { createContext, useContext } from 'react'
import { rootStore } from '@stores/root.store'

const StoreContext = createContext(rootStore)

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
}