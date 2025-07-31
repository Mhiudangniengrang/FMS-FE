import axiosClient from "../../../config/axiosClient"
import type { Asset } from "../types"

export const assetApi = {
  // Lấy danh sách tài sản
  getAssets: () => {
    return axiosClient.get<Asset[]>("/assets")
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