import type { Asset, NewAssetForm, AssetAssignment } from "../types"

export const filterAssets = (
  assets: Asset[],
  searchTerm: string,
  categoryFilter: string,
  statusFilter: string,
  departmentFilter: string
): Asset[] => {

  
  return assets.filter((asset) => {
    const matchesSearch =
      searchTerm === "" ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "" || asset.category === categoryFilter
    const matchesStatus = statusFilter === "" || asset.status === statusFilter
    const matchesDepartment = departmentFilter === "" || asset.department === departmentFilter



    return matchesSearch && matchesCategory && matchesStatus && matchesDepartment
  })
}

export const sortAssets = (
  assets: Asset[],
  sortBy: keyof Asset,
  sortOrder: "asc" | "desc"
): Asset[] => {
  return [...assets].sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
    return 0
  })
}

export const paginateAssets = (
  assets: Asset[],
  page: number,
  rowsPerPage: number
): Asset[] => {
  const startIndex = page * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  return assets.slice(startIndex, endIndex)
}

export const getAssetById = (assets: Asset[], id: number): Asset | undefined => {
  return assets.find((asset) => asset.id === id)
}

export const getAssetByCode = (assets: Asset[], assetCode: string): Asset | undefined => {
  return assets.find((asset) => asset.assetCode === assetCode)
}

export const getAssetsByCategory = (assets: Asset[], category: string): Asset[] => {
  return assets.filter((asset) => asset.category === category)
}

export const getAssetsByStatus = (assets: Asset[], status: string): Asset[] => {
  return assets.filter((asset) => asset.status === status)
}

export const getAssetsByDepartment = (assets: Asset[], department: string): Asset[] => {
  return assets.filter((asset) => asset.department === department)
}

export const getAssetsByAssignee = (assets: Asset[], assigneeId: string): Asset[] => {
  return assets.filter((asset) => asset.assigneeId === assigneeId)
}

export const getAssetStatistics = (assets: Asset[]) => {
  const totalAssets = assets.length
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)
  const statusCounts = assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const categoryCounts = assets.reduce((acc, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalAssets,
    totalValue,
    statusCounts,
    categoryCounts,
  }
}

export const validateAssetData = (asset: Partial<Asset>): string[] => {
  const errors: string[] = []

  if (!asset.name?.trim()) {
    errors.push("Tên tài sản là bắt buộc")
  }

  if (!asset.category?.trim()) {
    errors.push("Danh mục là bắt buộc")
  }

  if (!asset.value || asset.value <= 0) {
    errors.push("Giá trị phải lớn hơn 0")
  }

  return errors
}

export function convertFormToAsset(form: NewAssetForm): Asset {
  const now = new Date().toISOString()
  return {
    id: Date.now(), // hoặc để backend sinh lại nếu cần
    assetCode: "TS" + Date.now(),
    name: form.name,
    category: form.category,
    status: form.status,
    condition: form.condition,
    department: form.department,
    assignedTo: form.assignedTo,
    assigneeId: form.assigneeId,
    value: Number(form.value),
    quantity: Number(form.quantity),
    purchaseDate: form.purchaseDate,
    warrantyDate: form.warrantyDate,
    serialNumber: form.serialNumber,
    brand: form.brand,
    model: form.model,
    supplier: form.supplier,
    description: form.description,
    thumbnail: "", // hoặc lấy từ upload
    createdBy: "system", // hoặc lấy từ user hiện tại
    createdById: "system", // hoặc lấy từ user hiện tại
    createdAt: now,
    updatedAt: now,
    tags: form.tags,
    notes: form.notes,
    assignments: form.assignments || [],
  }
}

// Assignment utilities
export const getAssetAssignmentStats = (asset: Asset) => {
  const totalQuantity = asset.quantity
  const activeAssignments = asset.assignments?.filter(a => !a.isReturned) || []
  const returnedAssignments = asset.assignments?.filter(a => a.isReturned) || []
  
  const activeQuantity = activeAssignments.reduce((sum, assignment) => sum + assignment.quantity, 0)
  const returnedQuantity = returnedAssignments.reduce((sum, assignment) => sum + assignment.quantity, 0)
  const availableQuantity = totalQuantity - activeQuantity
  const usagePercentage = totalQuantity > 0 ? (activeQuantity / totalQuantity) * 100 : 0

  return {
    totalQuantity,
    activeQuantity,
    returnedQuantity,
    availableQuantity,
    usagePercentage,
    isFullyAssigned: availableQuantity === 0,
    isPartiallyAssigned: activeQuantity > 0 && availableQuantity > 0,
    isUnassigned: activeQuantity === 0,
    activeAssignments,
    returnedAssignments
  }
}

export const getAssetStatusByUsage = (asset: Asset): string => {
  const stats = getAssetAssignmentStats(asset)
  
  if (stats.isFullyAssigned) return "fully_used"
  if (stats.usagePercentage >= 80) return "limited"
  if (stats.isUnassigned) return "available"
  return "partially_used"
}

export const canAssignMore = (asset: Asset, requestedQuantity: number = 1): boolean => {
  const stats = getAssetAssignmentStats(asset)
  return stats.availableQuantity >= requestedQuantity
}

export const getAssignmentSummary = (asset: Asset) => {
  if (!asset.assignments || asset.assignments.length === 0) {
    return "Chưa có phân công"
  }

  const activeAssignments = asset.assignments.filter(a => !a.isReturned)
  if (activeAssignments.length === 0) {
    return "Tất cả đã được trả"
  }

  return activeAssignments.map(assignment => 
    `${assignment.departmentName}: ${assignment.quantity} chiếc (${assignment.assignedTo})`
  ).join(", ")
} 