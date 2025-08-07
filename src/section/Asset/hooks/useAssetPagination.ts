import { useState, useMemo, useCallback } from "react"
import type { Asset } from "../types"
import { paginateAssets, defaultPagination } from "../utils"

const useAssetPagination = (assets: Asset[]) => {
  const [page, setPage] = useState<number>(defaultPagination.page)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPagination.rowsPerPage)

  // Memoize pagination config
  const paginationConfig = useMemo(() => {
    return defaultPagination
  }, [])

  // Memoize paginated assets to prevent unnecessary recalculations
  const paginatedAssets = useMemo(() => {
    return paginateAssets(assets, page, rowsPerPage)
  }, [assets, page, rowsPerPage])

  // Memoize pagination info
  const totalPages = useMemo(() => {
    return Math.ceil(assets.length / rowsPerPage)
  }, [assets.length, rowsPerPage])

  const hasNextPage = useMemo(() => {
    return page < totalPages - 1
  }, [page, totalPages])

  const hasPrevPage = useMemo(() => {
    return page > 0
  }, [page])

  // Memoize handlers to prevent unnecessary re-renders
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
    setPage(0) // Reset to first page when changing rows per page
  }, [])

  const goToFirstPage = useCallback(() => {
    setPage(0)
  }, [])

  const goToLastPage = useCallback(() => {
    setPage(totalPages - 1)
  }, [totalPages])

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(page + 1)
    }
  }, [page, hasNextPage])

  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      setPage(page - 1)
    }
  }, [page, hasPrevPage])

  return {
    page,
    rowsPerPage,
    paginatedAssets,
    totalPages,
    hasNextPage,
    hasPrevPage,
    paginationConfig,
    handlePageChange,
    handleRowsPerPageChange,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
  }
}

export default useAssetPagination 