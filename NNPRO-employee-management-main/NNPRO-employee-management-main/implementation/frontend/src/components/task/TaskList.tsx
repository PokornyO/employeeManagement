import React, {useState} from "react";
import {Task, TaskResponse} from "../../types/task.ts";
import {
    Box,
    ListItem,
    IconButton,
    Typography,
    Divider, Tooltip, Avatar,
} from "@mui/material";
import { AccessTime, Edit, Delete } from "@mui/icons-material";
import ModalDialog from "../dialog/ModalDialog";
import locale from "../../locale/cs.json";
import { isUserProjectLeader } from "../../services/projectService";
import { useAuth } from "../providers/AuthProvider";
import PaginatedList from "../pagination/PaginatedList";
import { Role } from "../../types/role";
import { NavLink } from "react-router-dom";
import { useTheme } from "styled-components";
import ConfirmationDialog from "../dialog/ConfirmationDialog.tsx";
import {useProject} from "../providers/ProjectProvider.tsx";
import TaskForm from "../forms/TaskForm.tsx";
import {Status} from "../../types/project.ts";
import {getColorByDifficulty, getColorByStatus} from "../../utils/color.ts";


interface TaskListProps {
    fetchTasks: (page: number, size: number) => Promise<{items: Task[]; totalPages: number;}>;
    statuses: Status[];
    difficulties: Status[];
    onUpdate: (task: Task) => Promise<TaskResponse>;
    onDelete: (taskId: number) => void;
    refreshKey: number;
}

const TaskList: React.FC<TaskListProps> = ({fetchTasks, statuses, difficulties, onUpdate, onDelete, refreshKey,}) => {
    const { user, hasAccess } = useAuth();
    const theme = useTheme();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [editError, setEditError] = useState<string | null>(null);
    const { project } = useProject();

    const handleEditClick = (task: Task) => {
        setSelectedTask(task);
        setEditError(null);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (task: Task) => {
        setSelectedTask(task);
        setIsDeleteDialogOpen(true);
    };

    const handleEditSubmit = async (updatedTask: Task) => {
        const response = await onUpdate(updatedTask);
        if (response.success) {
            setIsEditDialogOpen(false);
        } else {
            setEditError(response.message ?? locale.ERROR_UPDATE_TASK);
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedTask) {
            onDelete(selectedTask.id);
        }
        setIsDeleteDialogOpen(false);
    };

    const renderTaskItem = (task: Task) => {
        const isUserInTask = task.assignedUsers.some(
            (assignedUser) => assignedUser.username === user!.username
        );

        return (
            <Box key={task.id} sx={{
                borderLeft: `3px solid ${isUserInTask ? theme.success : theme.primaryLight}`,
            }}>
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
                    <NavLink
                        to={`/projects/${project!.id}/tasks/${task.id}/attendances`}
                        style={{
                            flex: 1,
                            textDecoration: "none",
                            color: theme.text,
                        }}
                    >
                        <Typography variant="body1">{task.title}</Typography>
                        <Typography variant="body2" sx={{ color: "gray", marginTop: 0.5 }}>
                            {task.description}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: getColorByStatus(task.status.name, task.dueDate), marginTop: 0.5 }}
                        >
                            {task.status.label}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                color: getColorByStatus(task.status.name, task.dueDate),
                                alignItems: "center",
                                gap: 1,
                                marginTop: 0.5,
                            }}
                        >
                            <AccessTime fontSize="small" />
                            <Typography variant="body2">
                                {new Date(task.dueDate).toLocaleDateString("cs-CZ")}
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{ color: getColorByDifficulty(task.difficulty.name), marginTop: 0.5 }}
                        >
                            {task.difficulty.label}
                        </Typography>

                        <Box sx={{ marginTop: 1, display: "flex", gap: 1 }}>
                            {task.assignedUsers.map((assignedUser) => (
                                <Tooltip
                                    key={assignedUser.id}
                                    title={`${assignedUser.firstName} ${assignedUser.surname}`}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: theme.primaryLight,
                                            color: theme.text,
                                            width: 32,
                                            height: 32,
                                            fontSize: "0.75rem",
                                            border:
                                                assignedUser.username === user!.username
                                                    ? `2px solid ${theme.success}`
                                                    : "none",
                                        }}
                                    >
                                        {assignedUser.firstName![0]}
                                        {assignedUser.surname![0]}
                                    </Avatar>
                                </Tooltip>
                            ))}
                        </Box>
                    </NavLink>

                    {(hasAccess(Role.ADMIN) || isUserProjectLeader(project!, user!)) && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton onClick={() => handleEditClick(task)}>
                                <Edit sx={{ color: theme.text }} />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteClick(task)}>
                                <Delete sx={{ color: theme.text }} />
                            </IconButton>
                        </Box>
                    )}
                </ListItem>
                <Divider />
            </Box>
        );
    };


    return (
        <>
            <PaginatedList
                fetchData={fetchTasks}
                renderItem={renderTaskItem}
                pageSize={20}
                refreshKey={refreshKey}
            />
            <ModalDialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                title={locale.EDIT_TASK}
            >
                {selectedTask && (
                    <TaskForm
                        statuses={statuses}
                        difficulties={difficulties}
                        initialValues={{
                            id: selectedTask.id,
                            title: selectedTask.title,
                            description: selectedTask.description,
                            dueDate: selectedTask.dueDate,
                            status: selectedTask.status,
                            finishDate: selectedTask.finishDate,
                            difficulty: selectedTask.difficulty,
                            projectId: project!.id,
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
                message={`${locale.DELETE_TASK_CONFIRMATION} "${selectedTask?.title}"?`}
                confirmButtonText={locale.DELETE}
                cancelButtonText={locale.CANCEL}
            />
        </>
    );
};

export default TaskList;