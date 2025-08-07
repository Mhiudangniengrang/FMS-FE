import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { assetApi, type AssetSearchParams, type AssetSearchResponse } from "../services/assets"
import type { Asset } from "../types"

const useAssetSearch = () => {
  // Search state
  const [searchParams, setSearchParams] = useState<AssetSearchParams>({
    page: 0,
    limit: 10,
    sortBy: "name",
    sortOrder: "asc"
  })

  // Debounced search term for better performance
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // Use ref to track if this is the initial load
  const isInitialLoad = useRef(true)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // 300ms delay

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Memoized search parameters to prevent unnecessary re-renders
  const currentSearchParams = useMemo(() => {
    return {
      ...searchParams,
      search: debouncedSearchTerm || undefined
    }
  }, [searchParams, debouncedSearchTerm])

  // React Query for server-side search with better optimization
  const { data, isLoading, error, refetch } = useQuery<AssetSearchResponse>({
    queryKey: ['assets', 'search', currentSearchParams],
    queryFn: async () => {
      const result = await assetApi.searchAssets(currentSearchParams)
      return result.data
    },
    staleTime: 0, // Disable cache - always refetch
    gcTime: 0, // Don't keep cache in memory
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: true, // Always refetch on mount
    placeholderData: (previousData) => previousData, // Keep previous data while loading
    retry: 1, // Only retry once on error
    retryDelay: 1000, // Wait 1 second before retry
  })

  // Mark initial load as complete
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false
    }
  }, [])

  // Search handlers
  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
    // Don't update searchParams immediately - let debounce handle it
  }, [])

  const handleCategoryChange = useCallback((category: string) => {
    setSearchParams(prev => ({
      ...prev,
      category: category || undefined,
      page: 0
    }))
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    setSearchParams(prev => ({
      ...prev,
      status: status || undefined,
      page: 0
    }))
  }, [])

  const handleDepartmentChange = useCallback((department: string) => {
    setSearchParams(prev => ({
      ...prev,
      department: department || undefined,
      page: 0
    }))
  }, [])

  const handleSort = useCallback((sortBy: keyof Asset, sortOrder: "asc" | "desc") => {
    setSearchParams(prev => ({
      ...prev,
      sortBy: sortBy as keyof Asset,
      sortOrder
    }))
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage
    }))
  }, [])

  const handleRowsPerPageChange = useCallback((newLimit: number) => {
    setSearchParams(prev => ({
      ...prev,
      limit: newLimit,
      page: 0 // Reset to first page when changing page size
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setSearchParams({
      page: 0,
      limit: 10,
      sortBy: "name",
      sortOrder: "asc"
    })
    setSearchTerm("")
    setDebouncedSearchTerm("")
  }, [])

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return !!(
      debouncedSearchTerm ||
      searchParams.category ||
      searchParams.status ||
      searchParams.department
    )
  }, [debouncedSearchTerm, searchParams.category, searchParams.status, searchParams.department])

  return {
    // Data
    assets: data?.assets || [],
    total: data?.total || 0,
    page: data?.page || 0,
    limit: data?.limit || 10,
    totalPages: data?.totalPages || 0,
    
    // Loading states
    loading: isLoading,
    error: error?.message || null,
    
    // Current filters
    searchTerm: searchTerm, // Return the current search term (not debounced) for UI
    categoryFilter: searchParams.category || "",
    statusFilter: searchParams.status || "",
    departmentFilter: searchParams.department || "",
    sortBy: searchParams.sortBy || "name",
    sortOrder: searchParams.sortOrder || "asc",
    
    // Handlers
    onSearchChange: handleSearchChange,
    onCategoryChange: handleCategoryChange,
    onStatusChange: handleStatusChange,
    onDepartmentChange: handleDepartmentChange,
    onSort: handleSort,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    clearFilters,
    
    // Utilities
    hasActiveFilters,
    refetch,
  }
}

export default useAssetSearch 