import React from "react"
import {
  Box,
  Container,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material"
import type { Asset } from '../../types'
import {
  AssetFilters,
  AssetTable,
  AssetGrid,
  AssetDetailDialog,
  AddAssetDialog,
} from "../index"

import type { AssetLayoutProps } from '../../types'

const AssetLayout: React.FC<AssetLayoutProps> = ({
  data,
  loading,
  error,
  searchTerm,
  categoryFilter,
  statusFilter,
  departmentFilter,
  viewMode,
  sortBy,
  sortOrder,
  page,
  rowsPerPage,
  paginatedAssets,
  paginationConfig,
  selectedAsset,
  detailDialogOpen,
  addDialogOpen,
  addAssetForm,
  snackbarOpen,
  snackbarMessage,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onDepartmentChange,
  onViewModeChange,
  onSort,
  onViewDetail,
  onUpdate,
  onPageChange,
  onRowsPerPageChange,
  onAddAsset,
  onSubmitAsset,
  onCloseAddDialog,
  onCloseDetailDialog,
  onCloseSnackbar,
  onFormChange,
}) => {
  // Loading state
  if (loading) {
    return (
      <Box>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Hệ thống quản lý tài sản
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Đang tải dữ liệu...
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Hệ thống quản lý tài sản
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Lỗi: {error}
          </Alert>
        </Container>
      </Box>
    )
  }

  if (!data) return null

  return (
    <Box>
      <div style={{ marginLeft: '10px', marginRight: '10px', marginTop: '20px', marginBottom: '20px' }}> 
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Danh sách tài sản
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tổng số: {data.assets.length} tài sản
          </Typography>
        </Box>

        {/* Filters */}
        <AssetFilters
          data={{
            categories: data.categories,
            departments: data.departments,
            statusOptions: data.statusOptions,
          }}
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          departmentFilter={departmentFilter}
          viewMode={viewMode}
          onSearchChange={onSearchChange}
          onCategoryChange={onCategoryChange}
          onStatusChange={onStatusChange}
          onDepartmentChange={onDepartmentChange}
          onViewModeChange={onViewModeChange}
          onAddAsset={onAddAsset}
        />

        {/* Content */}
        {data.assets.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" color="text.secondary">
              Không tìm thấy tài sản nào
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </Typography>
          </Paper>
        ) : viewMode === "table" ? (
          <AssetTable
            assets={paginatedAssets}
            data={data}
            sortBy={sortBy as keyof Asset}
            sortOrder={sortOrder}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={data.assets.length}
            onSort={onSort}
            onViewDetail={onViewDetail}
            onUpdate={onUpdate}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPageOptions={paginationConfig.rowsPerPageOptions}
          />
        ) : (
          <AssetGrid
            assets={paginatedAssets}
            data={data}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={data.assets.length}
            onViewDetail={onViewDetail}
            onUpdate={onUpdate}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPageOptions={paginationConfig.rowsPerPageOptions}
          />
        )}

        {/* Dialogs */}
        <AddAssetDialog
          open={addDialogOpen}
          data={data}
          form={addAssetForm}
          onFormChange={onFormChange}
          onClose={onCloseAddDialog}
          onSubmit={onSubmitAsset}
        />

        <AssetDetailDialog
          asset={selectedAsset}
          data={data}
          open={detailDialogOpen}
          onClose={onCloseDetailDialog}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={onCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={onCloseSnackbar} severity="success" sx={{ borderRadius: 2 }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </Box>
  )
}

export default AssetLayout 