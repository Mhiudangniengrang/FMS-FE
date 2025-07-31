import { useState, useMemo, useCallback } from "react"
import type { Asset } from "../types"
import { filterAssets } from "../utils"

const useAssetFilters = (assets: Asset[]) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [locationFilter, setLocationFilter] = useState<string>("")

  // Memoize filtered assets to prevent unnecessary recalculations
  const filteredAssets = useMemo(() => {
    return filterAssets(assets, searchTerm, categoryFilter, statusFilter, locationFilter)
  }, [assets, searchTerm, categoryFilter, statusFilter, locationFilter])

  // Memoize setters to prevent unnecessary re-renders
  const setSearchTermCallback = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  const setCategoryFilterCallback = useCallback((value: string) => {
    setCategoryFilter(value)
  }, [])

  const setStatusFilterCallback = useCallback((value: string) => {
    setStatusFilter(value)
  }, [])

  const setLocationFilterCallback = useCallback((value: string) => {
    setLocationFilter(value)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setCategoryFilter("")
    setStatusFilter("")
    setLocationFilter("")
  }, [])

  const hasActiveFilters = useMemo(() => {
    return searchTerm !== "" || categoryFilter !== "" || statusFilter !== "" || locationFilter !== ""
  }, [searchTerm, categoryFilter, statusFilter, locationFilter])

  return {
    searchTerm,
    categoryFilter,
    statusFilter,
    locationFilter,
    setSearchTerm: setSearchTermCallback,
    setCategoryFilter: setCategoryFilterCallback,
    setStatusFilter: setStatusFilterCallback,
    setLocationFilter: setLocationFilterCallback,
    filteredAssets,
    clearFilters,
    hasActiveFilters,
  }
}

export default useAssetFilters 