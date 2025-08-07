
import type React from "react"
import { useQuery } from "@tanstack/react-query"

import {
  useAssetSearch,
  useAssetDialogs,
  usePerformanceMonitor,
} from "./hooks"
import { AssetLayout, AssetErrorBoundary } from "./components"
import { UpdateAssetDrawer } from "./components/dialogs"
import { categoryApi } from "./services/category"
import { employeeApi } from "./services/employee"
import { statusOptionApi } from "./services/statusOption"
import { conditionOptionApi } from "./services/conditionOption"
import { departmentApi } from "./services/department"
import type { Asset } from "./types"

const AssetManagement: React.FC = () => {
  // Performance monitoring
  usePerformanceMonitor("AssetManagement")

  // Server-side search hook (replaces client-side filtering, sorting, pagination)
  const {
    assets,
    total,
    page,
    limit,
    totalPages,
    loading: assetsLoading,
    error: assetsError,
    searchTerm,
    categoryFilter,
    statusFilter,
    departmentFilter,
    sortBy,
    sortOrder,
    onSearchChange,
    onCategoryChange,
    onStatusChange,
    onDepartmentChange,
    onSort,
    onPageChange,
    onRowsPerPageChange,
    clearFilters,
    hasActiveFilters,
    refetch,
  } = useAssetSearch()

  // React Query hooks cho các entity khác (không thay đổi)
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await categoryApi.getCategories()
      return result.data
    },
  })

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const result = await departmentApi.getDepartments()
      return result.data
    },
  })

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const result = await employeeApi.getEmployees()
      return result.data
    },
  })

  const { data: statusOptions = [] } = useQuery({
    queryKey: ['statusOptions'],
    queryFn: async () => {
      const result = await statusOptionApi.getStatusOptions()
      return result.data
    },
  })

  const { data: conditionOptions = [] } = useQuery({
    queryKey: ['conditionOptions'],
    queryFn: async () => {
      const result = await conditionOptionApi.getConditionOptions()
      return result.data
    },
  })

  // Dialog hooks (không thay đổi)
  const {
    selectedAsset,
    detailDialogOpen,
    addDialogOpen,
    updateDrawerOpen,
    addAssetForm,
    setAddAssetForm,
    snackbarOpen,
    snackbarMessage,
    handleViewAssetDetail,
    handleCloseDetailDialog,
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleOpenUpdateDrawer,
    handleCloseUpdateDrawer,
    handleAddAsset,
    handleUpdateAsset,
    handleDeleteAsset,
    handleCloseSnackbar,
    isAdding,
    isUpdating,
    isDeleting,
  } = useAssetDialogs()

  // Chuẩn bị object data tổng hợp
  const layoutData = {
    assets: assets || [],
    categories: categories || [],
    departments: departments || [],
    employees: employees || [],
    statusOptions: statusOptions || [],
    conditionOptions: conditionOptions || [],
  }

  // Loading state tổng hợp
  const loading = assetsLoading || !categories || !departments || !employees || !statusOptions || !conditionOptions

  // Pagination config cho AssetLayout
  const paginationConfig = {
    page,
    rowsPerPage: limit,
    total: total,
    totalPages,
    rowsPerPageOptions: [5, 10, 25, 50], // Add missing property
  }

  // Wrapper for onSort to match expected signature
  const handleSortWrapper = (property: keyof Asset) => {
    const newSortOrder = sortBy === property && sortOrder === "asc" ? "desc" : "asc"
    onSort(property, newSortOrder)
  }

  return (
    <AssetErrorBoundary>
      <AssetLayout
        // Data
        data={layoutData}
        loading={loading}
        error={assetsError}
        // Individual data properties
        assets={assets || []}
        categories={categories || []}
        departments={departments || []}
        employees={employees || []}
        statusOptions={statusOptions || []}
        conditionOptions={conditionOptions || []}
        // Filters (from server-side search)
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        departmentFilter={departmentFilter}
        // Sorting (from server-side search)
        sortBy={sortBy}
        sortOrder={sortOrder}
        // Pagination (from server-side search)
        page={page}
        rowsPerPage={limit}
        paginatedAssets={assets || []} // Server already returns paginated data
        sortedAssets={assets || []} // Server already returns sorted data
        paginationConfig={paginationConfig}
        // Dialogs
        selectedAsset={selectedAsset}
        detailDialogOpen={detailDialogOpen}
        addDialogOpen={addDialogOpen}
        addAssetForm={addAssetForm}
        snackbarOpen={snackbarOpen}
        snackbarMessage={snackbarMessage}
        // Handlers (from server-side search)
        onSearchChange={onSearchChange}
        onCategoryChange={onCategoryChange}
        onStatusChange={onStatusChange}
        onDepartmentChange={onDepartmentChange}
        onSort={handleSortWrapper}
        onViewDetail={handleViewAssetDetail}
        onUpdate={handleOpenUpdateDrawer}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onAddAsset={handleOpenAddDialog}
        onSubmitAsset={handleAddAsset}
        onUpdateAsset={handleUpdateAsset}
        onDeleteAsset={handleDeleteAsset}
        onCloseAddDialog={handleCloseAddDialog}
        onCloseDetailDialog={handleCloseDetailDialog}
        onCloseSnackbar={handleCloseSnackbar}
        onFormChange={setAddAssetForm}
        // Loading states
        isAdding={isAdding}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
      
      {/* Update Asset Drawer */}
      <UpdateAssetDrawer
        open={updateDrawerOpen}
        asset={selectedAsset}
        data={layoutData}
        onClose={handleCloseUpdateDrawer}
        onSubmit={handleUpdateAsset}
        isUpdating={isUpdating}
      />
    </AssetErrorBoundary>
  )
}

export default AssetManagement
