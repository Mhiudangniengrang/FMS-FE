import type { Category, Location } from '../entities'
import type { StatusOption } from '../options'

// Data interface for AssetFilters
export interface AssetFiltersData {
  categories: Category[]
  locations: Location[]
  statusOptions: StatusOption[]
}

// Filter values interface
export interface AssetFiltersValues {
  searchTerm: string
  categoryFilter: string
  statusFilter: string
  locationFilter: string
  viewMode: "table" | "grid"
}

// Event handlers interface
export interface AssetFiltersHandlers {
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onLocationChange: (value: string) => void
  onViewModeChange: (mode: "table" | "grid") => void
  onAddAsset: () => void
}

// Main AssetFilters props interface
export interface AssetFiltersProps extends 
  AssetFiltersValues, 
  AssetFiltersHandlers {
  data: AssetFiltersData | null
} 