import React, { useMemo, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  DepartmentSummaryCards,
  DepartmentSearchBar,
  DepartmentTable,
  DepartmentDetailDialog,
  DepartmentEmptyState,
  DepartmentFilter,
} from "./components";
import { useQuery } from "@tanstack/react-query";
import { assetApi } from "../Asset/services/assets";
import type { Asset } from "../Asset/types";

interface DepartmentSummary {
  department: string;
  assetCount: number;
  assets: Asset[];
  totalValue: number;
  categories: { [key: string]: number };
}

const Departments: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentSummary | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // Fetch assets data
  const {
    data: assets = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assets"],
    queryFn: () => assetApi.getAssets().then((res) => res.data),
  });

  // Group assets by department
  const departmentSummaries = useMemo(() => {
    const grouped: { [key: string]: DepartmentSummary } = {};

    assets.forEach((asset: Asset) => {
      const department = asset.department || t("Unassigned");

      if (!grouped[department]) {
        grouped[department] = {
          department,
          assetCount: 0,
          assets: [],
          totalValue: 0,
          categories: {},
        };
      }

      const assetQuantity = asset.quantity || 1;
      grouped[department].assetCount += assetQuantity;
      grouped[department].assets.push(asset);
      grouped[department].totalValue +=
        (Number(asset.value) || 0) * assetQuantity;

      // Count by category
      const category = asset.category || t("Others");
      grouped[department].categories[category] =
        (grouped[department].categories[category] || 0) + assetQuantity;
    });

    return Object.values(grouped);
  }, [assets, t]);

  // Filter departments based on search and selected departments
  const filteredDepartments = useMemo(() => {
    let filtered = departmentSummaries;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((department) =>
        department.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected departments
    if (selectedDepartments.length > 0) {
      filtered = filtered.filter((department) =>
        selectedDepartments.includes(department.department)
      );
    }

    return filtered;
  }, [departmentSummaries, searchQuery, selectedDepartments]);

  // Paginate filtered departments
  const paginatedDepartments = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredDepartments.slice(start, end);
  }, [filteredDepartments, page, rowsPerPage]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleViewDetails = (departmentSummary: DepartmentSummary) => {
    setSelectedDepartment(departmentSummary);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(0); // Reset to first page when searching
  };

  const handleDepartmentFilterChange = (departments: string[]) => {
    setSelectedDepartments(departments);
    setPage(0); // Reset to first page when filtering
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

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t("Loading data...")}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          {t("Error occurred while loading data")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          {t("departmentManagement")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("View which departments use which assets")}
        </Typography>
      </Box>

      {/* Summary Cards */}
      <DepartmentSummaryCards
        filteredDepartments={filteredDepartments}
        assets={assets}
        formatCurrency={formatCurrency}
      />

      {/* Search and Filter */}
      <Grid
        container
        spacing={2}
        sx={{ mb: 3, display: "flex", alignItems: "center" }}
      >
        <Grid size={{ xs: 12, md: 7 }}>
          <DepartmentSearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <DepartmentFilter
            departments={departmentSummaries.map((dept) => dept.department)}
            selectedDepartments={selectedDepartments}
            onDepartmentChange={handleDepartmentFilterChange}
          />
        </Grid>
      </Grid>

      {/* Department Table */}
      <DepartmentTable
        filteredDepartments={paginatedDepartments}
        totalCount={filteredDepartments.length}
        page={page}
        rowsPerPage={rowsPerPage}
        formatCurrency={formatCurrency}
        onViewDetails={handleViewDetails}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Detail Dialog */}
      <DepartmentDetailDialog
        open={detailDialogOpen}
        selectedDepartment={selectedDepartment}
        formatCurrency={formatCurrency}
        onClose={handleCloseDialog}
      />

      {/* Empty State */}
      {paginatedDepartments.length === 0 && filteredDepartments.length === 0 && (
        <DepartmentEmptyState />
      )}
    </Box>
  );
};

export default Departments;
