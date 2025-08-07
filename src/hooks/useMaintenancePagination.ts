import { useState, useMemo, useCallback } from "react"
import type { MaintenanceRequest } from "../types"

// Configuration cho pagination
const defaultPagination = {
  page: 0,
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 25, 50]
}

// Helper function để paginate maintenance requests
export const paginateMaintenanceRequests = (
  requests: MaintenanceRequest[],
  page: number,
  rowsPerPage: number
): MaintenanceRequest[] => {
  const startIndex = page * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  return requests.slice(startIndex, endIndex)
}

const useMaintenancePagination = (requests: MaintenanceRequest[]) => {
  const [page, setPage] = useState<number>(defaultPagination.page)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPagination.rowsPerPage)

  // Memoize paginated requests để tránh tính toán lại không cần thiết
  const paginatedRequests = useMemo(() => {
    return paginateMaintenanceRequests(requests, page, rowsPerPage)
  }, [requests, page, rowsPerPage])

  // Memoize pagination info
  const totalPages = useMemo(() => {
    return Math.ceil(requests.length / rowsPerPage)
  }, [requests.length, rowsPerPage])

  const hasNextPage = useMemo(() => {
    return page < totalPages - 1
  }, [page, totalPages])

  const hasPrevPage = useMemo(() => {
    return page > 0
  }, [page])

  // Memoize handlers để tránh re-renders không cần thiết
  const handlePageChange = useCallback((event: unknown, newPage: number) => {
    setPage(newPage)
  }, [])

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    setRowsPerPage(newRowsPerPage)
    setPage(0) // Reset về trang đầu khi thay đổi số hàng mỗi trang
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

  // Reset pagination khi có filter mới
  const resetPagination = useCallback(() => {
    setPage(0)
  }, [])

  return {
    // Current state
    page,
    rowsPerPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    
    // Paginated data
    paginatedRequests,
    
    // Configuration
    paginationConfig: {
      rowsPerPageOptions: defaultPagination.rowsPerPageOptions
    },
    
    // Handlers
    handlePageChange,
    handleRowsPerPageChange,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
    resetPagination,
    
    // Computed values
    totalCount: requests.length,
    startIndex: page * rowsPerPage,
    endIndex: Math.min((page + 1) * rowsPerPage, requests.length),
  }
}

export default useMaintenancePagination
