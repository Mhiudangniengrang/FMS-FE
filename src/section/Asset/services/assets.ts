import axiosClient from "../../../config/axiosClient"
import type { Asset } from "../types"

// Search parameters interface
export interface AssetSearchParams {
  search?: string
  category?: string
  status?: string
  department?: string
  page?: number
  limit?: number
  sortBy?: keyof Asset
  sortOrder?: "asc" | "desc"
}

// Search response interface
export interface AssetSearchResponse {
  assets: Asset[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const assetApi = {
  // Lấy danh sách tài sản
  getAssets: () => {
    return axiosClient.get<Asset[]>("/assets")
  },

  // Search assets với filters (Server-side)
  searchAssets: (params: AssetSearchParams) => {
    const searchParams = new URLSearchParams()
    
    if (params.search) searchParams.append('search', params.search)
    if (params.category) searchParams.append('category', params.category)
    if (params.status) searchParams.append('status', params.status)
    if (params.department) searchParams.append('department', params.department)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.limit) searchParams.append('limit', params.limit.toString())
    if (params.sortBy) searchParams.append('sortBy', params.sortBy.toString())
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder)
    
    const queryString = searchParams.toString()
    const url = queryString ? `/assets/search?${queryString}` : '/assets/search'
    
    return axiosClient.get<AssetSearchResponse>(url)
  },

  // Lấy chi tiết tài sản theo ID
  getAssetById: (id: number) => {
    return axiosClient.get<Asset>(`/assets/${id}`)
  },

  // Thêm tài sản mới
  createAsset: (assetData: Asset) => {
    return axiosClient.post<Asset>("/assets", assetData)
  },

  // Cập nhật tài sản
  updateAsset: (id: number, assetData: Partial<Asset>) => {
    return axiosClient.patch<Asset>(`/assets/${id}`, assetData)
  },

  // Xóa tài sản
  deleteAsset: (id: number) => {
    return axiosClient.delete(`/assets/${id}`)
  },
}