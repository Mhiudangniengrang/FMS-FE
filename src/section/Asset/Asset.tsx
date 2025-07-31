
import type React from "react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { viewModes } from "./utils"
import {
  useAssetData,
  useAssetFilters,
  useAssetSorting,
  useAssetPagination,
  useAssetDialogs,
  usePerformanceMonitor,
} from "./hooks"
import { AssetLayout, AssetErrorBoundary } from "./components"
import { categoryApi } from "./services/category"
import { locationApi } from "./services/location"
import { employeeApi } from "./services/employee"
import { statusOptionApi } from "./services/statusOption"
import { conditionOptionApi } from "./services/conditionOption"
type ViewMode = typeof viewModes.TABLE | typeof viewModes.GRID

const AssetManagement: React.FC = () => {
  // Performance monitoring
  usePerformanceMonitor("AssetManagement")

  const [viewMode, setViewMode] = useState<ViewMode>("table")

  // React Query hooks cho tất cả các entity
  const { data: assets, loading: assetsLoading, error: assetsError } = useAssetData()
  
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await categoryApi.getCategories()
      return result.data
    },
  })

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const result = await locationApi.getLocations()
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

  // Custom hooks
  const {
    searchTerm,
    categoryFilter,
    statusFilter,
    locationFilter,
    setSearchTerm,
    setCategoryFilter,
    setStatusFilter,
    setLocationFilter,
    filteredAssets,
  } = useAssetFilters(assets || [])
  const {
    sortBy,
    sortOrder,
    sortedAssets,
    handleSort,
  } = useAssetSorting(filteredAssets)
  const {
    page,
    rowsPerPage,
    paginatedAssets,
    paginationConfig,
    handlePageChange,
    handleRowsPerPageChange,
  } = useAssetPagination(sortedAssets, viewMode)
  const {
    selectedAsset,
    detailDialogOpen,
    addDialogOpen,
    addAssetForm,
    setAddAssetForm,
    snackbarOpen,
    snackbarMessage,
    handleViewAssetDetail,
    handleCloseDetailDialog,
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleAddAsset,
    handleUpdateAsset,
    handleDeleteAsset,
    handleCloseSnackbar,
    isAdding,
    isUpdating,
    isDeleting,
  } = useAssetDialogs()

  // Chuẩn bị object data tổng hợp
  const layoutData = assets
    ? {
        assets,
        categories,
        locations,
        employees,
        statusOptions,
        conditionOptions,
      }
    : null

  // Loading state tổng hợp
  const loading = assetsLoading || !categories || !locations || !employees || !statusOptions || !conditionOptions

  return (
    <AssetErrorBoundary>
      <AssetLayout
        // Data
        data={layoutData}
        loading={loading}
        error={assetsError}
        // Filters
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        locationFilter={locationFilter}
        viewMode={viewMode}
        // Sorting
        sortBy={sortBy}
        sortOrder={sortOrder}
        // Pagination
        page={page}
        rowsPerPage={rowsPerPage}
        paginatedAssets={paginatedAssets}
        sortedAssets={sortedAssets}
        paginationConfig={paginationConfig}
        // Dialogs
        selectedAsset={selectedAsset}
        detailDialogOpen={detailDialogOpen}
        addDialogOpen={addDialogOpen}
        addAssetForm={addAssetForm}
        snackbarOpen={snackbarOpen}
        snackbarMessage={snackbarMessage}
        // Handlers
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategoryFilter}
        onStatusChange={setStatusFilter}
        onLocationChange={setLocationFilter}
        onViewModeChange={setViewMode}
        onSort={handleSort}
        onViewDetail={handleViewAssetDetail}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
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
        isDeleting={isDeleting} assets={[]} categories={[]} locations={[]} employees={[]} statusOptions={[]} conditionOptions={[]}      />
    </AssetErrorBoundary>
  )
}

export default AssetManagement
