import { useState, useMemo, useCallback } from "react"
import type { Asset } from "../types"
import { filterAssets } from "../utils"

const useAssetFilters = (assets: Asset[]) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("")

  // Memoize filtered assets to prevent unnecessary recalculations
  const filteredAssets = useMemo(() => {
    return filterAssets(assets, searchTerm, categoryFilter, statusFilter, departmentFilter)
  }, [assets, searchTerm, categoryFilter, statusFilter, departmentFilter])

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

  const setDepartmentFilterCallback = useCallback((value: string) => {
    setDepartmentFilter(value)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setCategoryFilter("")
    setStatusFilter("")
    setDepartmentFilter("")
  }, [])

  const hasActiveFilters = useMemo(() => {
    return searchTerm !== "" || categoryFilter !== "" || statusFilter !== "" || departmentFilter !== ""
  }, [searchTerm, categoryFilter, statusFilter, departmentFilter])

  return {
    searchTerm,
    categoryFilter,
    statusFilter,
    departmentFilter,
    setSearchTerm: setSearchTermCallback,
    setCategoryFilter: setCategoryFilterCallback,
    setStatusFilter: setStatusFilterCallback,
    setDepartmentFilter: setDepartmentFilterCallback,
    filteredAssets,
    clearFilters,
    hasActiveFilters,
  }
}

export default useAssetFilters 