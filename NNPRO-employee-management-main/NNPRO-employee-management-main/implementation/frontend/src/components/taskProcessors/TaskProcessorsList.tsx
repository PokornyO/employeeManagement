import React from "react";
import { useTheme } from "styled-components";
import { Box, Divider, ListItem, Typography } from "@mui/material";
import PaginatedList from "../pagination/PaginatedList.tsx";
import locale from "../../locale/cs.json";
import {Member} from "../../types/member.ts";

interface TaskProcessorsListProps {
    fetchProcessors: (page: number, size: number) => Promise<{ items: {id: number; member: Member; hours: number | null }[]; totalPages: number }>;
    refreshKey: number;
}

const TaskProcessorsList: React.FC<TaskProcessorsListProps> = ({ fetchProcessors, refreshKey }) => {
    const theme = useTheme();

    const RenderProcessorsItem = ({ member, hours }: { member: Member; hours: number | null }) => (
        <Box key={member.id}>
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
                <Typography variant="body1">{member.username}</Typography>
                <Typography variant="body2">
                    {hours === null ? "Načítání..." : `${hours.toFixed(2)} odpracovaných hodin`}
                </Typography>
                <Typography variant="body2" sx={{ color: "gray", marginTop: 0.5 }}>
                    {member.email}
                </Typography>
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
                <Typography variant="body1" sx={{ flex: 5 }}>
                    {locale.TASK_PROCESSOR}
                </Typography>
                <Typography variant="body1" sx={{ flex: 7 }}>
                    {locale.TOTAL_HOURS}
                </Typography>
                <Typography variant="body1" sx={{ flex: 1 }}>
                    {locale.EMAIL}
                </Typography>
            </ListItem>

            <PaginatedList
                fetchData={fetchProcessors}
                renderItem={({ member, hours }) => <RenderProcessorsItem member={member} hours={hours} />}
                pageSize={20}
                refreshKey={refreshKey}
            />
        </>
    );
};

export default TaskProcessorsList;
