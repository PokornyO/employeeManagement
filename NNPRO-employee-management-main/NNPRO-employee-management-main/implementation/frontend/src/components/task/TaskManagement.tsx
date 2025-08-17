import React, {useEffect, useState} from "react";
import TaskList from "./TaskList.tsx";
import { useAuth } from "../providers/AuthProvider";
import AddButton from "../button/AddButton.tsx";
import { Role } from "../../types/role.ts";
import ModalDialog from "../dialog/ModalDialog.tsx";
import {Box, FormControl, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {
    createTask,
    deleteTask,
    getAllProjectTasks,
    updateTask,
    getTaskStatuses,
    getTaskDifficulties
} from "../../services/taskService.ts";
import {toast} from "react-toastify";
import {Task, TaskResponse} from "../../types/task.ts";
import {useProject} from "../providers/ProjectProvider.tsx";
import TaskForm from "../forms/TaskForm.tsx";
import locale from "../../locale/cs.json";
import {Status} from "../../types/project.ts";
import Loading from "../loading/Loading.tsx";
import {doesUserClaimTask} from "../../services/attendanceService.ts";

const TaskManagement: React.FC = () => {
    const {user, hasAccess } = useAuth();
    const { project } = useProject();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [difficulties, setDifficulties] = useState<Status[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedClaimStatus, setSelectedClaimStatus] = useState<"claimed" | "notClaimed" | "all">("all");

    useEffect(() => {
        getTaskStatuses()
            .then((response) => {
                if (response.success) {
                    setStatuses(response.statuses!);
                }
            }).finally(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        getTaskDifficulties()
            .then((response) => {
                if (response.success) {
                    setDifficulties(response.statuses!);
                }
            }).finally(() => {
            setLoading(false);
        });
    }, []);

    const handleAddTaskClick = () => {
        setIsAddDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsAddDialogOpen(false);
    };

    const handleCreateTask = async (task: Task) => {
        const response = await createTask(task);

        if (response.success) {
            toast.success(locale.TASK_SUCCESSFULLY_CREATED);
            setIsAddDialogOpen(false);
            setRefreshKey((prev) => prev + 1);
        } else {
            setAddError(response.message ?? locale.ERROR_CREATING_TASK);
        }
    };

    const handleUpdateTask = async (updatedTask: Task): Promise<TaskResponse> => {
        const response = await updateTask(updatedTask);

        if (response.success) {
            toast.success(locale.TASK_SUCCESSFULLY_UPDATED);
            setRefreshKey((prev) => prev + 1);
        } else {
            toast.error(response.message ?? locale.ERROR_UPDATE_TASK);
        }

        return response;
    };

    const handleDeleteTask = async (taskId: number) => {
        const response = await deleteTask(taskId);

        if (response.success) {
            toast.success(locale.TASK_SUCCESSFULLY_DELETED);
            setRefreshKey((prev) => prev + 1);
        } else {
            toast.error(response.message ?? locale.ERROR_DELETE_TASK);
        }
    };

    const fetchTasks = async (page: number, size: number) => {
        const response = await getAllProjectTasks(project!.id, page, size);
        if (response.success) {
            let tasksData = response.tasks ?? [];

            if (selectedStatus && selectedStatus !== "") {
                tasksData = tasksData.filter((task) => {
                    return task.status.name === selectedStatus;
                });
            }

            if (selectedClaimStatus === "claimed") {
                const tasksWithClaimStatus = await Promise.all(
                    tasksData.map(async (task) => {
                        const isClaimed = await doesUserClaimTask(task, user!);
                        return { task, isClaimed };
                    })
                );
                tasksData = tasksWithClaimStatus
                    .filter(({ isClaimed }) => isClaimed)
                    .map(({ task }) => task);
            } else if (selectedClaimStatus === "notClaimed") {
                const tasksWithClaimStatus = await Promise.all(
                    tasksData.map(async (task) => {
                        const isClaimed = await doesUserClaimTask(task, user!);
                        return { task, isClaimed };
                    })
                );
                tasksData = tasksWithClaimStatus
                    .filter(({ isClaimed }) => !isClaimed)
                    .map(({ task }) => task);
            }

            const sortedTasks = tasksData.sort((a, b) => {
                const dateA = new Date(a.dueDate).getTime();
                const dateB = new Date(b.dueDate).getTime();
                return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
            });

            return {
                items: sortedTasks,
                totalPages: response.pagination?.totalPages ?? 0,
            };
        } else {
            toast.error(response.message ?? locale.ERROR_LOADING_TASKS);
            return { items: [], totalPages: 0 };
        }
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setSelectedStatus(event.target.value);
        setRefreshKey((prev) => prev + 1);
    };

    const handleSortOrderChange = (event: SelectChangeEvent<string>) => {
        const newSortOrder = event.target.value as "asc" | "desc";
        setSortOrder(newSortOrder);
        setRefreshKey((prev) => prev + 1);
    };

    const handleClaimedStatusChange = (event: SelectChangeEvent<string>) => {
        const newClaimedStatus = event.target.value as "claimed" | "notClaimed" | "all";
        setSelectedClaimStatus(newClaimedStatus);
        setRefreshKey((prev) => prev + 1);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {hasAccess(Role.LEADER) && (
                <Box sx={{ marginBottom: 3 }}>
                    <AddButton onClick={handleAddTaskClick} />
                </Box>
            )}

            <Box sx={{ mb: 3 }}>
                <FormControl fullWidth sx={{ mb: 1}}>
                    <Select
                        value={selectedStatus || ""}
                        onChange={handleStatusChange}
                        displayEmpty
                        variant="outlined"
                    >
                        <MenuItem value="">{locale.ALL_STATUSES}</MenuItem>
                        {statuses.map((status) => (
                            <MenuItem key={status.name} value={status.name}>
                                {status.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 1}}>
                    <Select
                        value={sortOrder}
                        onChange={handleSortOrderChange}
                        variant="outlined"
                    >
                        <MenuItem value="asc">{locale.SORT_ASCENDING}</MenuItem>
                        <MenuItem value="desc">{locale.SORT_DESCENDING}</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <Select
                        value={selectedClaimStatus || ""}
                        onChange={handleClaimedStatusChange}
                        variant="outlined"
                    >
                        <MenuItem value="claimed">{locale.SORT_CLAIMED}</MenuItem>
                        <MenuItem value="notClaimed">{locale.SORT_NOT_CLAIMED}</MenuItem>
                        <MenuItem value="all">{locale.SORT_BOTH_STATES}</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <ModalDialog
                open={isAddDialogOpen}
                onClose={handleDialogClose}
                title={locale.NEW_TASK}
            >
                <TaskForm statuses={statuses} difficulties={difficulties} onSubmit={handleCreateTask} error={addError} />
            </ModalDialog>

            <TaskList
                fetchTasks={fetchTasks}
                statuses={statuses}
                difficulties={difficulties}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                refreshKey={refreshKey}
            />
        </>
    );
};

export default TaskManagement;