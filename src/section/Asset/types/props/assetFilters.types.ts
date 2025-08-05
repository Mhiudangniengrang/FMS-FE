import type { Category, Department } from '../entities'
import type { StatusOption } from '../options'

// Data interface for AssetFilters
export interface AssetFiltersData {
  categories: Category[]
  departments: Department[]
  statusOptions: StatusOption[]
}

// Filter values interface
export interface AssetFiltersValues {
  searchTerm: string
  categoryFilter: string
  statusFilter: string
  departmentFilter: string
  viewMode: "table" | "grid"
}

// Event handlers interface
export interface AssetFiltersHandlers {
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onDepartmentChange: (value: string) => void
  onViewModeChange: (mode: "table" | "grid") => void
  onAddAsset: () => void
}

// Main AssetFilters props interface
export interface AssetFiltersProps extends 
  AssetFiltersValues, 
  AssetFiltersHandlers {
  data: AssetFiltersData | null
} 