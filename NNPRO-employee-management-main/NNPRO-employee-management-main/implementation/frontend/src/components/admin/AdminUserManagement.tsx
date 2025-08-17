import React, { useState } from "react";
import { Box } from "@mui/material";
import AddButton from "../button/AddButton";
import ModalDialog from "../dialog/ModalDialog";
import UserAddForm from "../forms/UserAddForm";
import { Role } from "../../types/role";
import locale from "../../locale/cs.json";
import { UserRequest } from "../../types/user.ts";
import { createUser, deleteUser, fetchAllUsers } from "../../services/adminUserService.ts";
import { toast } from "react-toastify";
import UserList from "./UserList.tsx";

const AdminUserManagement: React.FC = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState<number>(0);

    const roles = Object.values(Role);

    const fetchUsers = async (page: number, size: number) => {
        const response = await fetchAllUsers(page, size);
        if (response.success) {
            return {
                items: response.users || [],
                totalPages: response.pagination?.totalPages ?? 0,
            };
        } else {
            toast.error(response.message ?? locale.ERROR_LOADING_USERS);
            return { items: [], totalPages: 0 };
        }
    };

    const handleAddUserClick = () => {
        setIsAddDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsAddDialogOpen(false);
        setAddError(null);
    };

    const handleCreateUser = async (user: UserRequest) => {
        const response = await createUser(user);

        if (response.success) {
            toast.success(locale.USER_SUCCESSFULLY_CREATED);
            setIsAddDialogOpen(false);
            setRefreshKey((prev) => prev + 1);
        } else {
            setAddError(response.message ?? locale.ERROR_CREATING_USER);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        const response = await deleteUser(userId);
        if (response.success) {
            toast.success(locale.USER_SUCCESSFULLY_DELETED);
            setRefreshKey((prev) => prev + 1);
        } else {
            toast.error(response.message);
        }
    };

    return (
        <>
            <Box sx={{ marginBottom: 2 }}>
                <AddButton onClick={handleAddUserClick} />
            </Box>

            <ModalDialog
                open={isAddDialogOpen}
                onClose={handleDialogClose}
                title={locale.NEW_USER}
            >
                <UserAddForm
                    onSubmit={handleCreateUser}
                    roles={roles}
                    error={addError}
                />
            </ModalDialog>

            <UserList
                fetchUsers={fetchUsers}
                onDelete={handleDeleteUser}
                refreshKey={refreshKey}
            />
        </>
    );
};

export default AdminUserManagement;
