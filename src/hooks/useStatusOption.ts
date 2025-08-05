import { statusOptionApi } from "@/section/Asset/services/statusOption";
import { useQuery } from "@tanstack/react-query";

export const useStatusOption = () => {
  const {
    data: statusOptions = [],
    isLoading: isLoadingStatusOptions,
    error: statusOptionsError,
  } = useQuery({
    queryKey: ["statusOptions"],
    queryFn: async () => {
      const response = await statusOptionApi.getStatusOptions();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });

  return {
    statusOptions,
    isLoadingStatusOptions,
    statusOptionsError,
  };
};
