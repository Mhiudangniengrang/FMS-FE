import type { Asset } from '../core'
import type { Category, Department, Employee } from '../entities'
import type { StatusOption, ConditionOption } from '../options'

// Data interface for AssetTable
export interface AssetTableData {
  categories: Category[]
  departments: Department[]
  employees: Employee[]
  statusOptions: StatusOption[]
  conditionOptions: ConditionOption[]
}

// Sorting interface
export interface AssetTableSorting {
  sortBy: keyof Asset
  sortOrder: "asc" | "desc"
}

// Pagination interface
export interface AssetTablePagination {
  page: number
  rowsPerPage: number
  totalCount: number
  rowsPerPageOptions: number[]
}

// Event handlers interface
export interface AssetTableHandlers {
  onSort: (property: keyof Asset) => void
  onViewDetail: (asset: Asset) => void
  onUpdate: (asset: Asset) => void
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
}

// Main AssetTable props interface
export interface AssetTableProps extends 
  AssetTableSorting, 
  AssetTablePagination, 
  AssetTableHandlers {
  assets: Asset[]
  data: AssetTableData | null
} 