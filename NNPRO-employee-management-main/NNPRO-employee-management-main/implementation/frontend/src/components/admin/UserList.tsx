import React, { useState } from "react";
import {
    Typography,
    Box,
    IconButton, ListItem, Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import locale from "../../locale/cs.json";
import { User } from "../../types/auth.ts";
import ConfirmationDialog from "../dialog/ConfirmationDialog.tsx";
import PaginatedList from "../pagination/PaginatedList";
import {useTheme} from "styled-components";

interface UserListProps {
    fetchUsers: (page: number, size: number) => Promise<{ items: User[]; totalPages: number }>;
    onDelete: (userId: number) => void;
    refreshKey: number;
}

const UserList: React.FC<UserListProps> = ({ fetchUsers, onDelete, refreshKey }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const theme = useTheme();

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedUser) {
            onDelete(selectedUser.id);
        }
        setIsDeleteDialogOpen(false);
    };

    const renderUserItem = (user: User) => (
        <Box key={user.id}>
            <ListItem
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingY: 2,
                    backgroundColor: theme.secondary,
                    color: 'inherit',
                    minHeight: '72px'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        flex: 1,
                        alignItems: { xs: 'flex-start', md: 'center' },
                        textDecoration: 'none',
                        color: 'inherit',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.text,
                            textAlign: 'left',
                            flexBasis: { xs: 'auto', md: '10%' },
                        }}
                    >
                        {user.id}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.text,
                            textAlign: 'left',
                            flexBasis: { xs: 'auto', md: '20%' },
                            marginLeft: { xs: 0, md: 2 },
                        }}
                    >
                        {user.firstName} {user.surname}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: 'gray',
                            textAlign: 'left',
                            flexBasis: { xs: 'auto', md: '25%' },
                            marginLeft: { xs: 0, md: 2 },
                        }}
                    >
                        {user.email}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: 'gray',
                            textAlign: 'left',
                            flexBasis: { xs: 'auto', md: '20%' },
                            marginLeft: { xs: 0, md: 2 },
                        }}
                    >
                        {user.phoneNumber ?? "—"}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: 'gray',
                            textAlign: 'left',
                            flexBasis: { xs: 'auto', md: '15%' },
                            marginLeft: { xs: 0, md: 2 },
                        }}
                    >
                        {user.role}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: '48px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <IconButton onClick={() => handleDeleteClick(user)}>
                        <Delete sx={{ color: "red" }} />
                    </IconButton>
                </Box>
            </ListItem>
            <Divider />
        </Box>
    );


    return (
        <>
            <ListItem
                sx={{
                    display: "flex",
                    alignItems: "center",
                    paddingY: 2,
                    gap: 5,
                    justifyContent: "space-between",
                    backgroundColor: theme.secondary,
                    color: theme.text,
                }}
            >
                <Typography variant="body1" sx={{ flex: .5 }}>
                    ID
                </Typography>
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {locale.USER}
                </Typography>
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {locale.EMAIL}
                </Typography>
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {locale.PHONE_NUMBER}
                </Typography>
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {locale.ROLE}
                </Typography>
            </ListItem>

            <PaginatedList
                fetchData={fetchUsers}
                renderItem={renderUserItem}
                pageSize={10}
                refreshKey={refreshKey}
            />

            <ConfirmationDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={locale.DELETE_CONFIRMATION}
                message={`${locale.DELETE_USER_CONFIRMATION} "${selectedUser?.username}"?`}
                confirmButtonText={locale.DELETE}
                cancelButtonText={locale.CANCEL}
            />
        </>
    );
};

export default UserList;
