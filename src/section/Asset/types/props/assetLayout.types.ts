import type { Asset, NewAssetForm } from '../core'
import type { Category, Location, Employee } from '../entities'
import type { StatusOption, ConditionOption } from '../options'

// Data interface
export interface AssetLayoutData {
  assets: Asset[]
  categories: Category[]
  locations: Location[]
  employees: Employee[]
  statusOptions: StatusOption[]
  conditionOptions: ConditionOption[]
}

// Filter interface
export interface AssetLayoutFilters {
  searchTerm: string
  categoryFilter: string
  statusFilter: string
  locationFilter: string
  viewMode: "table" | "grid"
}

// Sorting interface
export interface AssetLayoutSorting {
  sortBy: keyof Asset
  sortOrder: "asc" | "desc"
}

// Pagination interface
export interface AssetLayoutPagination {
  page: number
  rowsPerPage: number
  paginatedAssets: Asset[]
  sortedAssets: Asset[]
  paginationConfig: { rowsPerPageOptions: number[] }
}

// Dialog interface
export interface AssetLayoutDialogs {
  selectedAsset: Asset | null
  detailDialogOpen: boolean
  addDialogOpen: boolean
  addAssetForm: NewAssetForm
  snackbarOpen: boolean
  snackbarMessage: string
}

// Loading states interface
export interface AssetLayoutLoading {
  isAdding?: boolean
  isUpdating?: boolean
  isDeleting?: boolean
}

// Event handlers interface
export interface AssetLayoutHandlers {
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onLocationChange: (value: string) => void
  onViewModeChange: (mode: "table" | "grid") => void
  onSort: (property: keyof Asset) => void
  onViewDetail: (asset: Asset) => void
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onAddAsset: () => void
  onSubmitAsset: () => void
  onUpdateAsset: (id: number, data: Partial<Asset>) => void
  onDeleteAsset: (id: number) => void
  onCloseAddDialog: () => void
  onCloseDetailDialog: () => void
  onCloseSnackbar: () => void
  onFormChange: (form: NewAssetForm) => void
}

// Main AssetLayout props interface
export interface AssetLayoutProps extends 
  AssetLayoutData, 
  AssetLayoutFilters, 
  AssetLayoutSorting, 
  AssetLayoutPagination, 
  AssetLayoutDialogs, 
  AssetLayoutLoading, 
  AssetLayoutHandlers {
  data: AssetLayoutData | null
  loading: boolean
  error: string | null
} 