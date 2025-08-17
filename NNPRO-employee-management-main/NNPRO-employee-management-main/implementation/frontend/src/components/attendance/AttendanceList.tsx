import React, { useState } from "react";
import {
    Box,
    ListItem,
    IconButton,
    Typography,
    Divider,
} from "@mui/material";
import { AccessTime, Edit, Delete } from "@mui/icons-material";
import { Attendance, AttendanceResponse } from "../../types/attendance.ts";
import ModalDialog from "../dialog/ModalDialog";
import locale from "../../locale/cs.json";
import { useAuth } from "../providers/AuthProvider";
import PaginatedList from "../pagination/PaginatedList";
import { Role } from "../../types/role";
import { useTheme } from "styled-components";
import ConfirmationDialog from "../dialog/ConfirmationDialog.tsx";
import AttendanceForm from "../forms/AttendanceForm.tsx";

interface AttendanceListProps {
    fetchAttendance: (page: number, size: number) => Promise<{items: Attendance[]; totalPages: number;}>;
    onUpdate: (attendance: Attendance) => Promise<AttendanceResponse>;
    onDelete: (attendanceId: number) => void;
    refreshKey: number;
}

const AttendanceList: React.FC<AttendanceListProps> = ({fetchAttendance, onUpdate, onDelete, refreshKey,}) => {

    const { hasAccess } = useAuth();
    const theme = useTheme();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
    const [editError, setEditError] = useState<string | null>(null);

    const handleEditClick = (attendance: Attendance) => {
        setSelectedAttendance(attendance);
        setEditError(null);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (attendance: Attendance) => {
        setSelectedAttendance(attendance);
        setIsDeleteDialogOpen(true);
    };

    const handleEditSubmit = async (updatedAttendance: Attendance) => {
        const response = await onUpdate(updatedAttendance);
        if (response.success) {
            setIsEditDialogOpen(false);
        } else {
            setEditError(response.message ?? locale.ERROR_UPDATE_ATTENDANCE);
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedAttendance) {
            onDelete(selectedAttendance.id);
        }
        setIsDeleteDialogOpen(false);
    };
    const renderAttendanceItem = (attendance: Attendance) => (
        <Box key={attendance.id}>
            <ListItem
                sx={{
                    display: "flex",
                    alignItems: "center",
                    paddingY: 2,
                    gap: 5,
                    justifyContent: "space-between",
                    backgroundColor: theme.secondary,
                    color: theme.text,
                    "&:hover": {
                        backgroundColor: theme.primaryLight,
                    },
                }}
            >
                <Typography variant="body1">{attendance.appUser.username}</Typography>
                <Typography variant="body1">{attendance.workDescription}</Typography>
                <Box sx={{ display: "flex", color: "gray", alignItems: "center", gap: 1, marginTop: 0.5 }}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body2">
                        {new Date(attendance.startTime).toLocaleString("cs-CZ", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Typography>
                    <Typography variant="body2"> {"-\u00A0 " + new Date(attendance.endTime).toLocaleTimeString("cs-CZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                    </Typography>
                </Box>

                {(hasAccess(Role.EMPLOYEE)) && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => handleEditClick(attendance)}>
                            <Edit sx={{ color: theme.text }} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(attendance)}>
                            <Delete sx={{ color: theme.text }} />
                        </IconButton>
                    </Box>
                )}
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
                <Typography variant="body1" sx={{ flex: 0.55 }}>
                    {locale.USER}
                </Typography>
                <Typography variant="body1" sx={{ flex: 0.7 }}>
                    {locale.ATTENDANCE_TEXT}
                </Typography>
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {locale.ATTENDANCE_TIME}
                </Typography>
            </ListItem>

            <PaginatedList
                fetchData={fetchAttendance}
                renderItem={renderAttendanceItem}
                pageSize={20}
                refreshKey={refreshKey}
            />
            <ModalDialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                title={locale.EDIT_ATTENDANCE}
            >
                {selectedAttendance && (
                    <AttendanceForm
                        initialValues={{
                            id: selectedAttendance.id,
                            startTime: selectedAttendance.startTime,
                            endTime: selectedAttendance.endTime,
                        }}
                        onSubmit={handleEditSubmit}
                        submitButtonText={locale.SAVE_CHANGES}
                        error={editError}
                    />
                )}
            </ModalDialog>

            <ConfirmationDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={locale.DELETE_CONFIRMATION}
                message={`${locale.DELETE_ATTENDANCE_CONFIRMATION} ?`}
                confirmButtonText={locale.DELETE}
                cancelButtonText={locale.CANCEL}
            />
        </>
    );
};

export default AttendanceList;