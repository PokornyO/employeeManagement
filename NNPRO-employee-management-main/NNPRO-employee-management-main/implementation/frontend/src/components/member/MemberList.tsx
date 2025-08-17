import React, { useState } from "react";
import {
    Box,
    Divider,
    IconButton,
    ListItem,
    Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useTheme } from "styled-components";
import { useAuth } from "../providers/AuthProvider";
import { Role } from "../../types/role";
import ConfirmationDialog from "../dialog/ConfirmationDialog";
import { Member } from "../../types/member";
import { useProject } from "../providers/ProjectProvider";
import { isUserProjectLeader } from "../../services/projectService";
import locale from "../../locale/cs.json";
import PaginatedList from "../pagination/PaginatedList";

interface MemberListProps {
    fetchMembers: (
        page: number,
        size: number
    ) => Promise<{ items: Member[]; totalPages: number }>;
    onDelete: (memberId: number) => void;
    refreshKey: number;
}

const MemberList: React.FC<MemberListProps> = ({
   fetchMembers,
   onDelete,
   refreshKey,
}) => {
    const theme = useTheme();
    const { user, hasAccess } = useAuth();
    const { project, isProjectLeader } = useProject();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    const handleDeleteClick = (member: Member) => {
        setSelectedMember(member);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedMember) {
            onDelete(selectedMember.id);
        }
        setIsDeleteDialogOpen(false);
    };

    const renderMemberItem = (member: Member) => (
        <Box key={member.id}>
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
                        flexDirection: { xs: 'column', sm: 'row' },
                        flex: 1,
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        textDecoration: 'none',
                        color: 'inherit',
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.text,
                            textAlign: 'left',
                            flexBasis: { xs: 'auto', sm: '30%' },
                        }}
                    >
                        {member.firstName} {member.surname}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: 'gray',
                            textAlign: 'left',
                            flexBasis: { xs: 'auto', sm: '40%' },
                            marginLeft: { xs: 0, sm: 2 },
                        }}
                    >
                        {member.email}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: 'gray',
                            textAlign: 'left',
                            flexBasis: { xs: 'auto', sm: '30%' },
                            marginLeft: { xs: 0, sm: 2 },
                        }}
                    >
                        {isUserProjectLeader(project!, member)
                            ? locale.ROLE_LEADER
                            : locale.MEMBER}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: '48px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    {(hasAccess(Role.ADMIN) || isProjectLeader()) &&
                        member.id !== user!.id &&
                        member.id !== project!.leader.id && (
                            <IconButton onClick={() => handleDeleteClick(member)}>
                                <Delete sx={{ color: theme.text }} />
                            </IconButton>
                        )}
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
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {locale.USER}
                </Typography>
                <Typography variant="body1" sx={{ flex: 1.1 }}>
                    {locale.EMAIL}
                </Typography>
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {locale.ROLE}
                </Typography>
            </ListItem>

            <PaginatedList
                fetchData={fetchMembers}
                renderItem={renderMemberItem}
                pageSize={20}
                refreshKey={refreshKey}
            />

            <ConfirmationDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={locale.DELETE_CONFIRMATION}
                message={`${locale.REMOVE_MEMBER_CONFIRMATION} "${selectedMember?.firstName} ${selectedMember?.surname}" ${locale.FROM_PROJECT}?`}
                confirmButtonText={locale.REMOVE}
                cancelButtonText={locale.CANCEL}
            />
        </>
    );
};

export default MemberList;
