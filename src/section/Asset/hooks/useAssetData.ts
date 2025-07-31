import { useQuery } from "@tanstack/react-query"
import { assetApi } from "../services/assets"

const useAssetData = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const result = await assetApi.getAssets()
      return result.data
    },
  })

  return {
    data,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  }
}

export default useAssetData 