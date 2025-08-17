import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import locale from "../../locale/cs.json";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { calculateTotalHoursByTask, calculateTotalHoursByTaskAndUser, getAllTasksUsers } from "../../services/attendanceService.ts";
import TaskProcessorsList from "./TaskProcessorsList.tsx";
import CommentButton from "../button/CommentButton.tsx";
import { useProject } from "../providers/ProjectProvider.tsx";
import { useTask } from "../providers/TaskProvider.tsx";
import AssessmentButton from "../button/AssessmentButton.tsx";

const TaskProcessorsManagement: React.FC = () => {
    const [refreshKey] = useState<number>(0);
    const { task } = useTask();
    const navigate = useNavigate();
    const { project } = useProject();
    const [totalHours, setTotalHours] = useState(0);

    useEffect(() => {
        const fetchTotalHours = async () => {
            if (!task) return;
            const hours = await calculateTotalHoursByTask(task.id);
            setTotalHours(hours);
        };
        fetchTotalHours();
    }, [task?.id]);

    const fetchProcessors = async (page: number, size: number) => {
        const response = await getAllTasksUsers(Number(task?.id), page, size);
        if (response.success) {
            const membersWithHours = await Promise.all(
                (response.members ?? []).map(async (member) => {
                    const hours = await calculateTotalHoursByTaskAndUser(task!.id, member.id);
                    return { id: member.id, member, hours };
                })
            );
            return {
                items: membersWithHours,
                totalPages: response.pagination?.totalPages ?? 0,
            };
        } else {
            toast.error(response.message ?? locale.ERROR_LOADING_ATENDANCES);
            return { items: [], totalPages: 0 };
        }
    };



    const handleCommentsClick = () => {
        navigate(`/projects/${project?.id}/reports/${task?.id}/comments`);
    };

    const handleAssessmentClick = () => {
        navigate(`/projects/${project?.id}/reports/${task?.id}/performance`);
    };

    return (
        <>
            <Box sx={{ marginBottom: 3 }}>
                <CommentButton onClick={handleCommentsClick} />
            </Box>

            <Box sx={{ marginBottom: 3 }}>
                <AssessmentButton onClick={handleAssessmentClick} />
            </Box>

            <Box sx={{ marginBottom: 3 }}>
                <Typography
                    variant="body2"
                    sx={{ textAlign: "left", fontSize: "0.9rem" }}
                >
                    {"Datum dokončení: " + (task?.dueDate ? new Date(task.dueDate).toLocaleDateString("cs-CZ") : "N/A")}
                </Typography>
            </Box>

            <Box sx={{ marginBottom: 3 }}>
                <Typography
                    variant="body2"
                    sx={{ textAlign: "left", fontSize: "0.9rem" }}
                >
                    {"Celkem odpracovaných hodin na úkolu: " + totalHours}
                </Typography>
            </Box>

            <TaskProcessorsList
                fetchProcessors={fetchProcessors}
                refreshKey={refreshKey}
            />
        </>
    );
};

export default TaskProcessorsManagement;
