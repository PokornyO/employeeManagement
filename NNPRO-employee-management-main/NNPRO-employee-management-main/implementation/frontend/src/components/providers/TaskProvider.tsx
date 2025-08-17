import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {Typography} from "@mui/material";
import Loading from "../loading/Loading.tsx";
import locale from "../../locale/cs.json";
import {Task} from "../../types/task.ts";
import {getTaskById} from "../../services/taskService.ts";

interface TaskContextType {
    task: Task | null;
    loading: boolean;
    error: string | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = (): TaskContextType => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTask must be used within a TaskProvider");
    }
    return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { taskId } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (taskId) {
            setLoading(true);
            getTaskById(Number(taskId))
                .then(response => {
                    if (response.success) {
                        setTask(response.task ?? null);
                    } else {
                        setError(response.message ?? locale.ERROR_LOADING_TASKS);
                    }
                })
                .catch(() => setError(locale.ERROR_LOADING_TASKS))
                .finally(() => setLoading(false));
        }
    }, [taskId]);

    const value = useMemo(() => ({
        task,
        loading,
        error,
    }), [task, loading, error]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Typography variant="body1" color="error">{error}</Typography>;
    }

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};