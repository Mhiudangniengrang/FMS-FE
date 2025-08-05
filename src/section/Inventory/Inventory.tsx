import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography, Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Import hooks
import { useAssetManagement } from "@/hooks/useAsset";
import { useCategories } from "@/hooks/useCategories";
import { useStatusOption } from "@/hooks/useStatusOption";
import { useConditionOption } from "@/hooks/useConditionOption";
import { useDepartments } from "@/hooks/useDepartment";

// Import constants for colors
import { statusColors, conditionColors } from "@/section/Asset/utils/constants";

// Import components
import InventorySummaryCards from "./components/InventorySummaryCards";
import InventorySearchBar from "./components/InventorySearchBar";
import InventoryFilterPanel from "./components/InventoryFilterPanel";
import InventoryTable from "./components/InventoryTable";
import LowStockAlert from "./components/LowStockAlert";
import DeleteConfirm from "./components/DeleteConfirm";
import InventoryForm from "./components/InventoryForm";
import InventoryDetail from "./components/InventoryDetail";

// Types
interface InventoryItem {
  id: number;
  name: string;
  model: string;
  category: string;
  brand: string;
  department: string;
  totalQuantity: number;
  totalValue: number;
  averageValue: number;
  minStock: number;
  assets: any[];
  activeCount: number;
  inactiveCount: number;
  maintenanceCount: number;
  disposedCount: number;
  stockStatus: "Low" | "Normal";
  lastUpdated: string;
}

const Inventory: React.FC = () => {
  const { t } = useTranslation();

  // Use asset management hook
  const {
    assets = [],
    isLoading,
    error,
    refetch,
    createAssetMutation,
    updateAssetMutation,
    deleteAssetMutation,
    filters,
    setFilters,
  } = useAssetManagement();

  // Get options for filters and chips
  const { categories } = useCategories();
  const { statusOptions } = useStatusOption();
  const { conditionOptions } = useConditionOption();
  const { departments } = useDepartments(); // ✅ Sử dụng useDepartments

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]); // ✅ Thay selectedLocations thành selectedDepartments
  const [sortBy, setSortBy] = useState<
    "name" | "quantity" | "value" | "status"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog states
  const [openFormDrawer, setOpenFormDrawer] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<any | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Process asset data for summary cards and alerts
  const inventoryData = useMemo(() => {
    if (!assets.length) return [];

    // Group assets by name/model to calculate inventory summaries
    const inventory = assets.reduce((acc: InventoryItem[], asset: any) => {
      const existingItem = acc.find(
        (item) =>
          item.name === asset.name &&
          item.model === asset.model &&
          item.category === asset.category
      );

      if (existingItem) {
        existingItem.totalQuantity += asset.quantity || 1;
        existingItem.totalValue +=
          (Number(asset.value) || 0) * (asset.quantity || 1);
        existingItem.assets.push(asset);

        // Count by status (multiplied by quantity)
        const qty = asset.quantity || 1;
        if (asset.status === "in_use") existingItem.activeCount += qty;
        else if (asset.status === "available")
          existingItem.inactiveCount += qty;
        else if (asset.status === "maintenance")
          existingItem.maintenanceCount += qty;
        else if (asset.status === "broken" || asset.status === "retired")
          existingItem.disposedCount += qty;
      } else {
        const qty = asset.quantity || 1;
        acc.push({
          id: asset.id,
          name: asset.name,
          model: asset.model || t("Unknown"),
          category: asset.category || t("Others"),
          brand: asset.brand || t("Unknown"),
          department: asset.department || t("Unassigned"), // ✅ Thay location thành department
          totalQuantity: qty,
          totalValue: (Number(asset.value) || 0) * qty,
          averageValue: Number(asset.value) || 0,
          minStock: 5,
          assets: [asset],
          activeCount: asset.status === "in_use" ? qty : 0,
          inactiveCount: asset.status === "available" ? qty : 0,
          maintenanceCount: asset.status === "maintenance" ? qty : 0,
          disposedCount:
            asset.status === "broken" || asset.status === "retired" ? qty : 0,
          stockStatus: "Normal" as const,
          lastUpdated: asset.updatedAt || new Date().toISOString(),
        });
      }
      return acc;
    }, []);

    // Calculate average value and stock status
    inventory.forEach((item: any) => {
      item.averageValue = item.totalValue / item.totalQuantity;
      item.stockStatus = item.totalQuantity <= item.minStock ? "Low" : "Normal";
    });

    return inventory;
  }, [assets, t]);

  // Filter raw assets for the table (not grouped data)
  const filteredAssets = useMemo(() => {
    return assets.filter((asset: any) => {
      // Search filter
      const matchSearch =
        asset.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assetCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.category?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(asset.category);

      // Department filter (thay location filter)
      const matchDepartment =
        selectedDepartments.length === 0 ||
        selectedDepartments.includes(asset.department);

      // Status filter
      const matchStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(asset.status);

      return matchSearch && matchCategory && matchDepartment && matchStatus;
    });
  }, [
    assets,
    searchQuery,
    selectedCategories,
    selectedDepartments, // ✅ Thay selectedLocations thành selectedDepartments
    selectedStatuses,
  ]);

  // Sort filtered assets
  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "quantity":
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case "value":
          aValue = a.value;
          bValue = b.value;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredAssets, sortBy, sortOrder]);

  // Paginated assets for table
  const paginatedAssets = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedAssets.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedAssets, page, rowsPerPage]);

  // Get unique values for filters from raw assets
  const uniqueCategories = [
    ...new Set(assets.map((asset: any) => asset.category).filter(Boolean)),
  ];
  const uniqueDepartments = [
    // ✅ Thay uniqueLocations thành uniqueDepartments
    ...new Set(assets.map((asset: any) => asset.department).filter(Boolean)),
  ];

  // Event handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(0);
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    setPage(0);

    // Update API filters
    if (categories.length > 0) {
      setFilters({ ...filters, category: categories[0] });
    } else {
      const { category, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleStatusChange = (statuses: string[]) => {
    setSelectedStatuses(statuses);
    setPage(0);

    // Update API filters
    if (statuses.length > 0) {
      setFilters({ ...filters, status: statuses[0] });
    } else {
      const { status, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleDepartmentChange = (departments: string[]) => {
    // ✅ Thay handleLocationChange thành handleDepartmentChange
    setSelectedDepartments(departments);
    setPage(0);
  };

  const handleSortChange = (field: typeof sortBy, order: typeof sortOrder) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // CRUD handlers with API integration
  const handleAdd = () => {
    setEditingAsset(null);
    setOpenFormDrawer(true);
  };

  const handleEdit = (asset: any) => {
    setEditingAsset(asset);
    setOpenFormDrawer(true);
  };

  const handleDelete = (asset: any) => {
    setDeletingAsset(asset);
    setOpenDeleteDialog(true);
  };

  // Form submission handler - Updated with API integration
  const handleFormSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingAsset) {
        // Update existing asset
        await updateAssetMutation.mutateAsync({
          id: editingAsset.id,
          ...data,
        });
      } else {
        // Create new asset
        await createAssetMutation.mutateAsync(data);
      }

      setOpenFormDrawer(false);
      setEditingAsset(null);
    } catch (error) {
      console.error("Error saving asset:", error);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete confirmation handler - Updated with API integration
  const handleConfirmDelete = async () => {
    if (deletingAsset) {
      try {
        await deleteAssetMutation.mutateAsync(deletingAsset.id);
        setOpenDeleteDialog(false);
        setDeletingAsset(null);
      } catch (error) {
        console.error("Error deleting asset:", error);
      }
    }
  };

  // Helper functions to get colors from constants
  const getStatusColor = (
    status: string
  ):
    | "success"
    | "primary"
    | "warning"
    | "error"
    | "default"
    | "info"
    | "secondary" => {
    return statusColors[status] || "default";
  };

  const getConditionColor = (
    condition: string
  ):
    | "success"
    | "primary"
    | "warning"
    | "error"
    | "default"
    | "info"
    | "secondary" => {
    return conditionColors[condition] || "default";
  };

  const [viewingAsset, setViewingAsset] = useState<any | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const handleView = (asset: any) => {
    setViewingAsset(asset);
    setOpenDetailDialog(true);
  };
  // Helper functions for labels (use API data for labels)
  const getStatusLabel = (status: string) => {
    const option = statusOptions.find((s) => s.value === status);
    return option?.label || status;
  };

  const getConditionLabel = (condition: string) => {
    const option = conditionOptions.find((c) => c.value === condition);
    return option?.label || condition;
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t("Loading data...")}</Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          {t("Error occurred while loading data")}: {error.toString()}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            {t("inventoryManagement")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("Monitor stock levels, values and asset conditions")}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          {t("addAsset")}
        </Button>
      </Box>

      {/* Low Stock Alert - use grouped data */}
      <LowStockAlert inventoryData={inventoryData} />

      {/* Summary Cards - use grouped data */}
      <InventorySummaryCards
        inventoryData={inventoryData}
        formatCurrency={formatCurrency}
      />

      {/* Search and Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <InventorySearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <InventoryFilterPanel
            categories={uniqueCategories}
            departments={uniqueDepartments}
            selectedCategories={selectedCategories}
            selectedStatuses={selectedStatuses}
            selectedDepartments={selectedDepartments}
            onCategoryChange={handleCategoryChange}
            onStatusChange={handleStatusChange}
            onDepartmentChange={handleDepartmentChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </Grid>
      </Grid>

      {/* Inventory Table - use raw asset data */}
      <InventoryTable
        inventoryData={paginatedAssets}
        totalCount={sortedAssets.length}
        page={page}
        rowsPerPage={rowsPerPage}
        formatCurrency={formatCurrency}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        // Add CRUD handlers
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        // Add options for chip colors
        statusOptions={statusOptions}
        conditionOptions={conditionOptions}
        // Use constants-based color functions
        getStatusColor={getStatusColor}
        getConditionColor={getConditionColor}
        // Add missing label functions
        getStatusLabel={getStatusLabel}
        getConditionLabel={getConditionLabel}
      />

      {/* Form Drawer */}
      <InventoryForm
        open={openFormDrawer}
        onClose={() => setOpenFormDrawer(false)}
        onSubmit={handleFormSubmit}
        editingAsset={editingAsset}
        isLoading={
          formLoading ||
          createAssetMutation.isPending ||
          updateAssetMutation.isPending
        }
        categories={categories}
        statusOptions={statusOptions}
        conditionOptions={conditionOptions}
        departments={departments} // ✅ Thay locations thành departments
        employees={[]} // Add employees data if needed
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirm
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        asset={deletingAsset}
        isLoading={deleteAssetMutation.isPending}
      />

      {/* Asset Detail Dialog */}
      <InventoryDetail
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        asset={viewingAsset}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default Inventory;
