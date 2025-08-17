import {Task} from "../../types/task.ts";
import React from "react";
import {useTheme} from "styled-components";
import {useProject} from "../providers/ProjectProvider.tsx";
import {Box, Divider, ListItem, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import {getColorByDifficulty, getColorByStatus} from "../../utils/color.ts";
import {AccessTime} from "@mui/icons-material";
import PaginatedList from "../pagination/PaginatedList.tsx";

interface ReportListProps {
    fetchTasks: (page: number, size: number) => Promise<{items: Task[]; totalPages: number;}>;
    refreshKey: number;
}

const ReportList: React.FC<ReportListProps> = ({fetchTasks, refreshKey,}) => {
    const theme = useTheme();
    const { project } = useProject();

    const renderTaskItem = (task: Task) => (
        <Box key={task.id}>
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
                    to={`/projects/${project.id}/reports/${task.id}`}
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
                    <Typography variant="body2" sx={{ color: getColorByStatus(task.status.name, task.dueDate), marginTop: 0.5 }}>
                        {task.status.label}
                    </Typography>
                    <Box sx={{ display: "flex", color: getColorByStatus(task.status.name, task.dueDate), alignItems: "center", gap: 1, marginTop: 0.5 }}>
                        <AccessTime fontSize="small" />
                        <Typography variant="body2">
                            {new Date(task.dueDate).toLocaleDateString("cs-CZ")}
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: getColorByDifficulty(task.difficulty.name), marginTop: 0.5 }}>
                        {task.difficulty.label}
                    </Typography>
                </NavLink>
            </ListItem>
            <Divider />
        </Box>
    );

    return (
        <>
            <PaginatedList
                fetchData={fetchTasks}
                renderItem={renderTaskItem}
                pageSize={20}
                refreshKey={refreshKey}
            />
        </>
    );
};

export default ReportList;