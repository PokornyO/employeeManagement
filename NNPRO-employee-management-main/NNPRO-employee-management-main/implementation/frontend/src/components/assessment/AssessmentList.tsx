import React, {useState} from "react";
import {useAuth} from "../providers/AuthProvider.tsx";
import {useTheme} from "styled-components";
import locale from "../../locale/cs.json";
import {Box, Divider, IconButton,ListItem, Typography} from "@mui/material";
import {AccessTime, Delete, Edit} from "@mui/icons-material";
import PaginatedList from "../pagination/PaginatedList.tsx";
import ModalDialog from "../dialog/ModalDialog.tsx";
import ConfirmationDialog from "../dialog/ConfirmationDialog.tsx";
import {Assessment, AssessmentResponse} from "../../types/assessment.ts";
import {Role} from "../../types/role.ts";
import AssessmentForm from "../forms/AssessmentForm.tsx";

interface AssessmentListProps {
    fetchAssessments: (page: number, size: number) => Promise<{items: Assessment[]; totalPages: number;}>;
    onUpdate: (assessment: Assessment) => Promise<AssessmentResponse>;
    onDelete: (assessmentId: number) => void;
    refreshKey: number;
}

const AssessmentList: React.FC<AssessmentListProps> = ({fetchAssessments, onUpdate, onDelete, refreshKey,}) => {

    const { hasAccess } = useAuth();
    const theme = useTheme();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
    const [editError, setEditError] = useState<string | null>(null);

    const handleEditClick = (assessment: Assessment) => {
        setSelectedAssessment(assessment);
        setEditError(null);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (assessment: Assessment) => {
        setSelectedAssessment(assessment);
        setIsDeleteDialogOpen(true);
    };

    const handleEditSubmit = async (updatedAssessment: Assessment) => {
        const response = await onUpdate(updatedAssessment);
        if (response.success) {
            setIsEditDialogOpen(false);
        } else {
            setEditError(response.message ?? locale.ERROR_UPDATE_ASSESSMENT);
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedAssessment) {
            onDelete(selectedAssessment.id);
        }
        setIsDeleteDialogOpen(false);
    };
    const renderAssessmentItem = (assessment: Assessment) => (
        <Box key={assessment.id}>
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
                <Typography variant="body1">{assessment.appUser.username}</Typography>
                <Typography variant="body1">{assessment.feedback}</Typography>
                <Typography variant="body1">{assessment.overallRating}</Typography>
                <Box sx={{ display: "flex", color: "gray", alignItems: "center", gap: 1, marginTop: 0.5 }}>
                    <AccessTime fontSize="small" />
                    <Typography variant="body2">
                        {new Date(assessment.reviewDate).toLocaleDateString("cs-CZ")}
                    </Typography>
                </Box>
                {(hasAccess(Role.EMPLOYEE)) && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => handleEditClick(assessment)}>
                            <Edit sx={{ color: theme.text }} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(assessment)}>
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
                <Typography variant="body1" sx={{ flex: 0.5 }}>
                    {locale.USER}
                </Typography>
                <Typography variant="body1" sx={{ flex: 0.5 }}>
                    {locale.ASSESSMENT_TEXT}
                </Typography>
                <Typography variant="body1" sx={{ flex: 0.6 }}>
                    {locale.ASSESSMENT_VALUE}
                </Typography>
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {locale.CREATION_DATE}
                </Typography>
            </ListItem>

            <PaginatedList
                fetchData={fetchAssessments}
                renderItem={renderAssessmentItem}
                pageSize={20}
                refreshKey={refreshKey}
            />
            <ModalDialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                title={locale.EDIT_ASSESSMENT}
            >
                {selectedAssessment && (
                    <AssessmentForm
                        initialValues={{
                            id: selectedAssessment.id,
                            reviewDate: selectedAssessment.reviewDate,
                            feedback: selectedAssessment.feedback,
                            overallRating: selectedAssessment.overallRating,
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
                message={`${locale.DELETE_ASSESSMENT_CONFIRMATION} ?`}
                confirmButtonText={locale.DELETE}
                cancelButtonText={locale.CANCEL}
            />
        </>
    );
};

export default AssessmentList;