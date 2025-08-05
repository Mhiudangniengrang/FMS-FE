export interface Asset {
  id: number
  assetCode: string
  name: string
  category: string
  status: string
  condition: string
  department: string
  assignedTo: string
  assigneeId: string
  value: number
  purchaseDate: string
  warrantyDate: string
  serialNumber: string
  brand: string
  model: string
  supplier: string
  description: string
  thumbnail: string
  createdBy: string
  createdById: string
  createdAt: string
  updatedAt: string
  tags: string[]
  notes: string
}

export interface NewAssetForm {
  name: string
  category: string
  brand: string
  model: string
  serialNumber: string
  description: string
  department: string
  assignedTo: string
  assigneeId: string
  status: string
  condition: string
  value: string
  purchaseDate: string
  warrantyDate: string
  supplier: string
  notes: string
  tags: string[]
} 