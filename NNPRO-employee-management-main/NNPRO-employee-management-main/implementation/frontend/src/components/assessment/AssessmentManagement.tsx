import React, {useState} from "react";
import {useAuth} from "../providers/AuthProvider.tsx";
import {useTask} from "../providers/TaskProvider.tsx";
import {toast} from "react-toastify";
import locale from "../../locale/cs.json";
import {Box} from "@mui/material";
import AddButton from "../button/AddButton.tsx";
import ModalDialog from "../dialog/ModalDialog.tsx";
import {Assessment, AssessmentResponse} from "../../types/assessment.ts";
import {
    createAssessment,
    deleteAssessment,
    getAllTaskMembersAssessment,
    updateAssessment
} from "../../services/assessmentService.ts";
import AssessmentList from "./AssessmentList.tsx";
import AssessmentForm from "../forms/AssessmentForm.tsx";

const AssessmentManagement: React.FC = () => {
    const { user, hasAccess } = useAuth();
    const { task } = useTask();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState<number>(0);

    const handleAddAssessmentClick = () => {
        setIsAddDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsAddDialogOpen(false);
        setAddError(null);
    };


    const handleCreateAssessment = async (assessment: Assessment) => {
        const response = await createAssessment(assessment);

        if (response.success) {
            toast.success(locale.ASSESSMENT_SUCCESSFULLY_CREATED);
            setIsAddDialogOpen(false);
            setRefreshKey((prev) => prev + 1);
        } else {
            setAddError(response.message ?? locale.ERROR_CREATING_ASSESSMENT);
        }
    };

    const handleUpdateAssessment = async (updatedAssessment: Assessment): Promise<AssessmentResponse> => {
        const response = await updateAssessment(updatedAssessment);
        if (response.success) {
            toast.success(locale.ASSESSMENT_SUCCESSFULLY_UPDATED);
            setRefreshKey((prev) => prev + 1);
        } else {
            toast.error(response.message ?? locale.ERROR_UPDATE_ASSESSMENT);
        }
        return response;
    };

    const handleDeleteAssessment = async (assessmentId: number) => {
        const response = await deleteAssessment(assessmentId);

        if (response.success) {
            toast.success(locale.ASSESSMENT_SUCCESSFULLY_DELETED);
            setRefreshKey((prev) => prev + 1);
        } else {
            toast.error(response.message ?? locale.ERROR_DELETE_ASSESSMENT);
        }
    };

    const fetchAssessments = async (page: number, size: number) => {
        const response = await getAllTaskMembersAssessment(task!.id, page, size);
        if (response.success) {
            return {
                items: response.assessments ?? [],
                totalPages: response.pagination?.totalPages ?? 0,
            };
        } else {
            toast.error(response.message ?? locale.ERROR_LOADING_ASSESSMENTS);
            return { items: [], totalPages: 0 };
        }
    };

    return (
        <>
            <Box sx={{ marginBottom: 3 }}>
                <AddButton onClick={handleAddAssessmentClick} />
            </Box>

            <ModalDialog
                open={isAddDialogOpen}
                onClose={handleDialogClose}
                title={locale.NEW_ASSESSMENT}
            >
                <AssessmentForm onSubmit={handleCreateAssessment} error={addError}/>
            </ModalDialog>

            <AssessmentList
                fetchAssessments={fetchAssessments}
                onUpdate={handleUpdateAssessment}
                onDelete={handleDeleteAssessment}
                refreshKey={refreshKey}
            />
        </>
    );
};

export default AssessmentManagement;