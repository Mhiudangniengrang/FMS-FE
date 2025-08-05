import { categoryApi } from "@/section/Asset/services/category";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryApi.getCategories();
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
  
  return {
    categories,
    isLoadingCategories,
    categoriesError,
  };
};
