import React, {useEffect, useState} from "react";
import AddButton from "../button/AddButton.tsx";
import ModalDialog from "../dialog/ModalDialog.tsx";
import { Box } from "@mui/material";
import {
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAllTasksAttendance,
    assignTask, doesUserClaimTask,
} from "../../services/attendanceService.ts";
import {toast} from "react-toastify";
import locale from "../../locale/cs.json";
import {Attendance, AttendancesResponse} from "../../types/attendance.ts";
import AttendanceList from "./AttendanceList.tsx";
import AttendanceForm from "../forms/AttendanceForm.tsx";
import {useTask} from "../providers/TaskProvider.tsx";
import {Role} from "../../types/role.ts";
import {useAuth} from "../providers/AuthProvider.tsx";
import {isUserProjectLeader} from "../../services/projectService.ts";
import {useProject} from "../providers/ProjectProvider.tsx";
import MemberForm from "../forms/MemberForm.tsx";
import {Member} from "../../types/member.ts";
import AssignButton from "../button/AssignButton.tsx";
import ConfirmationDialog from "../dialog/ConfirmationDialog.tsx";
import ClaimButton from "../button/ClaimButton.tsx";
import AttendanceButton from "../button/AttendanceButton.tsx";

const AttendanceManagement: React.FC = () => {
    const { user, hasAccess } = useAuth();
    const { task } = useTask();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [isClaimTaskDialogOpen, setIsClaimTaskDialogOpen] = useState<boolean>(false);
    const [isAssignMemberDialogOpen, setIsAssignMemberDialogOpen] = useState<boolean>(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const { project } = useProject();
    const [isClaimed, setIsClaimed] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchClaimStatus = async () => {
            const claimed = await doesUserClaimTask(task!, user!);
            setIsClaimed(claimed);
        };
        fetchClaimStatus();
    }, [task, user]);

    const handleAddAttendanceClick = () => {
        setIsAddDialogOpen(true);
    };

    const handleClaimTaskClick = () => {
        setIsClaimTaskDialogOpen(true);
    };

    const handleAssignMemberToTaskClick = async () => {
        setIsAssignMemberDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsAddDialogOpen(false);
        setAddError(null);
    };

    const handleDialogMemberClose = () => {
        setIsAssignMemberDialogOpen(false);
        setAddError(null);
    }

    const handleClaimTask = async () => {
        const response = await assignTask(user!.id, task!.id);

        if (response.success) {
            toast.success(`${locale.CLAIM_TASK_SUCCESSFUL}`);
            setIsClaimTaskDialogOpen(false);
            setIsClaimed(true);
            setRefreshKey((prev) => prev + 1);
        } else {
            setAddError(response.message ?? locale.ERROR_CLAIMING_TASK);
        }
    };

    const handleAssignMember = async (member: Member) => {
        const response = await assignTask(member!.id, task!.id);

        if (response.success) {
            toast.success(`${locale.TO_MEMBER} ${member.firstName} ${member.surname} ${locale.MEMBER_ASSIGN_END}`);
            setIsAddDialogOpen(false);
            setRefreshKey((prev) => prev + 1);
        } else {
            setAddError(response.message ?? locale.ERROR_ASSIGNING_MEMBER);
        }
    };

    const handleCreateAttendance = async (attendance: Attendance) => {
        const response = await createAttendance(attendance);

        if (response.success) {
            toast.success(locale.ATTENDANCE_SUCCESSFULLY_CREATED);
            setIsAddDialogOpen(false);
            setRefreshKey((prev) => prev + 1);
        } else {
            setAddError(response.message ?? locale.ERROR_CREATING_ATTENDANCE);
        }
    };

    const handleUpdateAttendance = async (updatedAttendance: Attendance): Promise<AttendancesResponse> => {
        const response = await updateAttendance(updatedAttendance);
        if (response.success) {
            toast.success(locale.ATTENDANCE_SUCCESSFULLY_UPDATED);
            setRefreshKey((prev) => prev + 1);
        } else {
            toast.error(response.message ?? locale.ERROR_UPDATE_ATTENDANCE);
        }
        return response;
    };

    const handleDeleteAttendance = async (attendanceId: number) => {
        const response = await deleteAttendance(attendanceId);

        if (response.success) {
            toast.success(locale.ATTENDANCE_SUCCESSFULLY_DELETED);
            setRefreshKey((prev) => prev + 1);
        } else {
            toast.error(response.message ?? locale.ERROR_DELETE_ATTENDANCE);
        }
    };

    const fetchAttendances = async (page: number, size: number) => {
        const response = await getAllTasksAttendance(task!.id, page, size);
        if (response.success) {
            return {
                items: response.attendances ?? [],
                totalPages: response.pagination?.totalPages ?? 0,
            };
        } else {
            toast.error(response.message ?? locale.ERROR_LOADING_ATENDANCES);
            return { items: [], totalPages: 0 };
        }
    };

    return (
        <>
            {(hasAccess(Role.ADMIN) || isUserProjectLeader(project!, user!)) && (
                <Box sx={{ marginBottom: 3 }}>
                    <AssignButton onClick={handleAssignMemberToTaskClick} />
                </Box>
            )}

            <ModalDialog
                open={isAssignMemberDialogOpen}
                onClose={handleDialogMemberClose}
                title={locale.ASSIGN_TASK}
            >
                <MemberForm onSubmit={handleAssignMember} error={addError}/>
            </ModalDialog>

            {isClaimed && (
                <Box sx={{ marginBottom: 3 }}>
                    <AttendanceButton onClick={handleAddAttendanceClick} />
                </Box>
            )}

            <ModalDialog
                open={isAddDialogOpen}
                onClose={handleDialogClose}
                title={locale.NEW_ATTENDANCE}
            >
                <AttendanceForm onSubmit={handleCreateAttendance} error={addError} />
            </ModalDialog>

            {!isClaimed && (
                <Box sx={{ marginBottom: 3 }}>
                    <ClaimButton onClick={handleClaimTaskClick} />
                </Box>
            )}

            <ConfirmationDialog
                open={isClaimTaskDialogOpen}
                onClose={() => setIsClaimTaskDialogOpen(false)}
                onConfirm={handleClaimTask}
                title={locale.CLAIM_CONFIRMATION}
                message={`${locale.CLAIM_TASK_CONFIRMATION} ?`}
                confirmButtonText={locale.CLAIM}
                cancelButtonText={locale.CANCEL}
            />

            <AttendanceList
                fetchAttendance={fetchAttendances}
                onUpdate={handleUpdateAttendance}
                onDelete={handleDeleteAttendance}
                refreshKey={refreshKey}
            />
        </>
    );
};

export default AttendanceManagement;