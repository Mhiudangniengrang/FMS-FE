import { conditionOptionApi } from "@/section/Asset/services/conditionOption";
import { useQuery } from "@tanstack/react-query";

export const useConditionOption = () => {
  const {
    data: conditionOptions = [],
    isLoading: isLoadingConditionOptions,
    error: conditionOptionsError,
  } = useQuery({
    queryKey: ["conditionOptions"],
    queryFn: async () => {
      const response = await conditionOptionApi.getConditionOptions();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });

  return {
    conditionOptions,
    isLoadingConditionOptions,
    conditionOptionsError,
  };
};
