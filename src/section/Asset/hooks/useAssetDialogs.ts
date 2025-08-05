import { useState, useCallback } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Asset, NewAssetForm } from "../types"
import { assetApi } from "../services/assets"
import { convertFormToAsset } from "../utils/assetUtils"

const useAssetDialogs = () => {
  const queryClient = useQueryClient()
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false)
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false)
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState<boolean>(false)
  const [addAssetForm, setAddAssetForm] = useState<NewAssetForm>({
    name: "",
    category: "",
    brand: "",
    model: "",
    serialNumber: "",
    description: "",
    location: "",
    assignedTo: "",
    assigneeId: "",
    status: "",
    condition: "",
    value: "",
    purchaseDate: "",
    warrantyDate: "",
    supplier: "",
    notes: "",
    tags: [],
  })
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>("")

  // Mutations
  const addAssetMutation = useMutation({
    mutationFn: assetApi.createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      setSnackbarMessage("Tài sản đã được thêm thành công!")
      setSnackbarOpen(true)
      handleCloseAddDialog()
    },
    onError: () => {
      setSnackbarMessage("Có lỗi khi thêm tài sản!")
      setSnackbarOpen(true)
    }
  })

  const updateAssetMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Asset> }) => 
      assetApi.updateAsset(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      setSnackbarMessage("Tài sản đã được cập nhật thành công!")
      setSnackbarOpen(true)
    },
    onError: () => {
      setSnackbarMessage("Có lỗi khi cập nhật tài sản!")
      setSnackbarOpen(true)
    }
  })

  const deleteAssetMutation = useMutation({
    mutationFn: assetApi.deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      setSnackbarMessage("Tài sản đã được xóa thành công!")
      setSnackbarOpen(true)
    },
    onError: () => {
      setSnackbarMessage("Có lỗi khi xóa tài sản!")
      setSnackbarOpen(true)
    }
  })

  // Memoize handlers to prevent unnecessary re-renders
  const handleViewAssetDetail = useCallback((asset: Asset) => {
    setSelectedAsset(asset)
    setDetailDialogOpen(true)
  }, [])

  const handleCloseDetailDialog = useCallback(() => {
    setDetailDialogOpen(false)
    setSelectedAsset(null)
  }, [])

  const handleOpenAddDialog = useCallback(() => {
    setAddDialogOpen(true)
  }, [])

  const handleCloseAddDialog = useCallback(() => {
    setAddDialogOpen(false)
    setAddAssetForm({
      name: "",
      category: "",
      brand: "",
      model: "",
      serialNumber: "",
      description: "",
      location: "",
      assignedTo: "",
      assigneeId: "",
      status: "",
      condition: "",
      value: "",
      purchaseDate: "",
      warrantyDate: "",
      supplier: "",
      notes: "",
      tags: [],
    })
  }, [])

  const handleOpenUpdateDrawer = useCallback((asset: Asset) => {
    setSelectedAsset(asset)
    setUpdateDrawerOpen(true)
  }, [])

  const handleCloseUpdateDrawer = useCallback(() => {
    setUpdateDrawerOpen(false)
    setSelectedAsset(null)
  }, [])

  const handleAddAsset = useCallback(async () => {
    const asset = convertFormToAsset(addAssetForm)
    addAssetMutation.mutate(asset)
  }, [addAssetForm, addAssetMutation])

  const handleUpdateAsset = useCallback((id: number, data: Partial<Asset>) => {
    updateAssetMutation.mutate({ id, data })
    handleCloseUpdateDrawer()
  }, [updateAssetMutation, handleCloseUpdateDrawer])

  const handleDeleteAsset = useCallback((id: number) => {
    deleteAssetMutation.mutate(id)
  }, [deleteAssetMutation])

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false)
  }, [])

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }, [])

  return {
    selectedAsset,
    detailDialogOpen,
    addDialogOpen,
    updateDrawerOpen,
    addAssetForm,
    setAddAssetForm,
    snackbarOpen,
    snackbarMessage,
    handleViewAssetDetail,
    handleCloseDetailDialog,
    handleOpenAddDialog,
    handleCloseAddDialog,
    handleOpenUpdateDrawer,
    handleCloseUpdateDrawer,
    handleAddAsset,
    handleUpdateAsset,
    handleDeleteAsset,
    handleCloseSnackbar,
    showSnackbar,
    // Mutation states
    isAdding: addAssetMutation.isPending,
    isUpdating: updateAssetMutation.isPending,
    isDeleting: deleteAssetMutation.isPending,
  }
}

export default useAssetDialogs 