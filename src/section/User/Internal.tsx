import React, { useState, useMemo, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useUserManagement } from "@/hooks/useUserManagement";
import type { CreateUserForm, User } from "@/types/user.types";
import {
  UserTable,
  UserStats,
  UserFilters,
  UserForm,
  DeleteConfirmation,
  Header,
} from "./components";

const Internal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  const {
    users,
    isLoading,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    page,
    setPage,
    limit,
    setLimit,
    totalCount,
  } = useUserManagement();

  // Filter only internal users (supervisor, manager, staff)
  const internalUsers =
    users?.filter(
      (u: User) =>
        u.role === "manager" || u.role === "supervisor" || u.role === "staff"
    ) || [];

  // Filter and search users
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(internalUsers) || internalUsers.length === 0) {
      return [];
    }

    let result = [...internalUsers];

    // Apply role filter
    if (filterRole !== "all") {
      result = result.filter((user: User) => user.role === filterRole);
    }

    // Apply search query
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const query = trimmedQuery.toLowerCase();
      result = result.filter((user: User) => {
        // Kiểm tra null/undefined trước khi gọi toLowerCase()
        const name = user.name ? user.name.toLowerCase() : "";
        const email = user.email ? user.email.toLowerCase() : "";
        const phone = user.phone ? user.phone.toLowerCase() : "";

        return (
          name.includes(query) || email.includes(query) || phone.includes(query)
        );
      });
    }

    return result;
  }, [internalUsers, searchQuery, filterRole]);

  // Phân trang dữ liệu đã lọc - đơn giản hóa logic
  const paginatedUsers = useMemo(() => {
    // Nếu đang thực hiện lọc (có search query hoặc filter), thì phân trang ở client
    if (searchQuery || filterRole !== "all") {
      const startIndex = page * limit;
      const endIndex = startIndex + limit;

      // Nếu không có dữ liệu hoặc vượt quá kích thước, trả về mảng rỗng
      if (filteredUsers.length === 0 || startIndex >= filteredUsers.length) {
        return [];
      }

      return filteredUsers.slice(startIndex, endIndex);
    } else {
      // Nếu không lọc, hiển thị dữ liệu từ server (đã được phân trang)
      return users || [];
    }
  }, [filteredUsers, users, page, limit, searchQuery, filterRole]);

  // Reset page when filter/search changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery, filterRole, setPage]);

  // Đảm bảo trang hiện tại không vượt quá số trang tối đa
  useEffect(() => {
    // Nếu đang lọc, kiểm tra trang hiện tại không vượt quá tổng số trang
    if (searchQuery || filterRole !== "all") {
      if (filteredUsers.length > 0) {
        const maxPage = Math.max(
          0,
          Math.ceil(filteredUsers.length / limit) - 1
        );
        if (page > maxPage) {
          // Chuyển về trang cuối cùng nếu trang hiện tại vượt quá
          setPage(maxPage);
        }
      }
    } else if (totalCount > 0) {
      // Nếu không lọc, dùng totalCount để tính toán trang tối đa
      const maxPage = Math.max(0, Math.ceil(totalCount / limit) - 1);
      if (page > maxPage) {
        setPage(maxPage);
      }
    }
  }, [
    filteredUsers.length,
    totalCount,
    limit,
    page,
    setPage,
    searchQuery,
    filterRole,
  ]);

  const handleClose = () => {
    setOpen(false);
    // Reset editing user and form mode when closing
    setEditingUser(null);
    setFormMode("create");
  };

  const handleEdit = (user: User) => {
    // Kiểm tra xem role của user có hợp lệ để edit không
    if (
      user.role !== "manager" &&
      user.role !== "supervisor" &&
      user.role !== "staff"
    ) {
      alert("Cannot edit this user type");
      return;
    }

    setEditingUser(user);
    setFormMode("edit");
    setOpen(true);
  };

  // Add new function to handle opening the create user form
  const handleOpenCreateForm = () => {
    setEditingUser(null);
    setFormMode("create");
    setOpen(true);
  };

  const handleFormSubmit = (data: CreateUserForm) => {
    if (formMode === "edit" && editingUser) {
      // Update existing user
      let payload: any = {
        id: editingUser.id,
        ...data,
      };
      // If no password is provided in edit mode, keep the existing password
      if (!data.password && editingUser.password) {
        payload.password = editingUser.password;
      }
      updateUserMutation.mutate(payload);
    } else {
      // Create new user
      createUserMutation.mutate(data);
    }
    handleClose();
  };

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete !== null) {
      deleteUserMutation.mutate(userToDelete);
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Hàm xóa tìm kiếm
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Header onCreateUser={handleOpenCreateForm} />

      {/* Stats Cards */}
      <UserStats internalUsers={internalUsers} />

      {/* Search and Filter */}
      <UserFilters
        searchQuery={searchQuery}
        filterRole={filterRole}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilterRole}
        onClearSearch={handleClearSearch}
      />

      {/* Users Table */}
      <UserTable
        users={paginatedUsers}
        page={page}
        limit={limit}
        totalCount={totalCount}
        filteredUsers={filteredUsers}
        isFiltering={!!(searchQuery || filterRole !== "all")}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(0);
        }}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Create/Edit User Form */}
      <UserForm
        open={open}
        onClose={handleClose}
        onSubmit={handleFormSubmit}
        formMode={formMode}
        editingUser={editingUser}
        isSubmitting={
          createUserMutation.isPending || updateUserMutation.isPending
        }
        error={createUserMutation.error || updateUserMutation.error}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteUserMutation.isPending}
      />
    </Box>
  );
};

export default Internal;
