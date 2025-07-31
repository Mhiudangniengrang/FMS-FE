import { useState, useMemo, useCallback } from "react"
import type { Asset } from "../types"
import { sortAssets } from "../utils"

const useAssetSorting = (assets: Asset[]) => {
  const [sortBy, setSortBy] = useState<keyof Asset>("assetCode")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Memoize sorted assets to prevent unnecessary recalculations
  const sortedAssets = useMemo(() => {
    return sortAssets(assets, sortBy, sortOrder)
  }, [assets, sortBy, sortOrder])

  // Memoize sort handler to prevent unnecessary re-renders
  const handleSort = useCallback((property: keyof Asset) => {
    setSortBy(property)
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"))
  }, [])

  const resetSorting = useCallback(() => {
    setSortBy("assetCode")
    setSortOrder("asc")
  }, [])

  return {
    sortBy,
    sortOrder,
    sortedAssets,
    handleSort,
    resetSorting,
  }
}

export default useAssetSorting 