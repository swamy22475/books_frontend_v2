import { useEffect, useState } from 'react'

/**
 * Hook to detect if component has mounted on the client side.
 * Prevents hydration mismatches and layout shifts by deferring renders
 * that depend on client-only state or localStorage.
 */
export function useClientMount(): boolean {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}
