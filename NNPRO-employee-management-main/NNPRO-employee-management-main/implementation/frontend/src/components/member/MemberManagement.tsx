// MemberManagement.tsx
import React, { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import AddButton from "../button/AddButton";
import { Role } from "../../types/role";
import ModalDialog from "../dialog/ModalDialog";
import { Box } from "@mui/material";
import MemberList from "./MemberList";
import MemberForm from "../forms/MemberForm";
import {
    addMemberToProject,
    removeMemberFromProject,
    getAllProjectMembers,
} from "../../services/memberService";
import { Member } from "../../types/member";
import { useProject } from "../providers/ProjectProvider";
import { toast } from "react-toastify";
import locale from "../../locale/cs.json";

const MemberManagement: React.FC = () => {
    const { hasAccess } = useAuth();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const { project } = useProject();

    const handleAddMemberClick = async () => {
        setIsAddDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsAddDialogOpen(false);
        setAddError(null);
    };

    const handleAddMember = async (member: Member) => {
        const response = await addMemberToProject(project!.id, member.id);

        if (response.success) {
            toast.success(`${locale.USER} ${member.firstName} ${member.surname} ${locale.MEMBER_ADD_END}`);
            setIsAddDialogOpen(false);
            setRefreshKey((prev) => prev + 1);
        } else {
            setAddError(response.message ?? locale.ERROR_ADDING_MEMBER);
        }
    };

    const handleRemoveMember = async (memberId: number) => {
        const response = await removeMemberFromProject(project!.id, memberId);

        if (response.success) {
            toast.success(`${locale.USER} ${locale.MEMBER_REMOVED_END}`);
            setRefreshKey((prev) => prev + 1);
        } else {
            toast.error(response.message ?? locale.ERROR_DELETE_MEMBER);
        }
    };

    const fetchMembers = async (page: number, size: number) => {
        try {
            const response = await getAllProjectMembers(project!.id, page, size);
            if (response.success) {
                let members = response.members ?? [];

                if (page == 0) {
                    members = [project!.leader, ...members];
                }

                return {
                    items: members,
                    totalPages: response.pagination?.totalPages ?? 0,
                };
            } else {
                toast.error(response.message ?? locale.ERROR_LOADING_MEMBERS);
                return { items: [], totalPages: 0 };
            }
        } catch (error) {
            toast.error(locale.ERROR_LOADING_MEMBERS);
            return { items: [], totalPages: 0 };
        }
    };


    return (
        <>
            {hasAccess(Role.LEADER) && (
                <Box sx={{ marginBottom: 2 }}>
                    <AddButton onClick={handleAddMemberClick} />
                </Box>
            )}

            <ModalDialog
                open={isAddDialogOpen}
                onClose={handleDialogClose}
                title={locale.ADD_MEMBER}
            >
                <MemberForm
                    onSubmit={handleAddMember}
                    error={addError}
                />
            </ModalDialog>

            <MemberList
                fetchMembers={fetchMembers}
                onDelete={handleRemoveMember}
                refreshKey={refreshKey}
            />
        </>
    );
};

export default MemberManagement;
