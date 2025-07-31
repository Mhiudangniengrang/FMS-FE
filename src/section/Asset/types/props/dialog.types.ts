import type { Asset, NewAssetForm } from '../core'
import type { Category, Location, Employee } from '../entities'
import type { StatusOption, ConditionOption } from '../options'

// Common dialog data interface
export interface DialogData {
  categories: Category[]
  locations: Location[]
  employees: Employee[]
  statusOptions: StatusOption[]
  conditionOptions: ConditionOption[]
}

// AddAssetDialog props interface
export interface AddAssetDialogProps {
  open: boolean
  data: DialogData | null
  form: NewAssetForm
  onFormChange: (form: NewAssetForm) => void
  onClose: () => void
  onSubmit: () => void
}

// AssetDetailDialog props interface
export interface AssetDetailDialogProps {
  open: boolean
  asset: Asset | null
  data: DialogData | null
  onClose: () => void
  onEdit: (asset: Asset) => void
  onDelete: (id: number) => void
} 