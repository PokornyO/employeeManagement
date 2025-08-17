import React, {useState} from "react";
import {toast} from "react-toastify";
import locale from "../../locale/cs.json";
import {useProject} from "../providers/ProjectProvider.tsx";
import {getAllProjectTasks} from "../../services/taskService.ts";
import ReportList from "./ReportList.tsx";

const ReportManagement: React.FC = () => {
    const [refreshKey] = useState<number>(0);
    const { project } = useProject();
    const [selectedStatus,] = useState<string | null>('COMPLETED')


    const fetchCompletedTasks = async (page: number, size: number) => {
        const response = await getAllProjectTasks(project!.id, page, size);
        if (response.success) {
            const tasksData = response.tasks ?? [];
            console.log(tasksData);
            const filteredTasks = tasksData.filter((task) => task.status.name === selectedStatus);
            console.log(filteredTasks);


            return {
                items: filteredTasks,
                totalPages: response.pagination?.totalPages ?? 0,
            };
        } else {
            toast.error(response.message ?? locale.ERROR_LOADING_TASKS);
            return { items: [], totalPages: 0 };
        }
    };

    return (
        <>
            <ReportList
                fetchTasks={fetchCompletedTasks}
                refreshKey={refreshKey}
            />
        </>
    );
};

export default ReportManagement;