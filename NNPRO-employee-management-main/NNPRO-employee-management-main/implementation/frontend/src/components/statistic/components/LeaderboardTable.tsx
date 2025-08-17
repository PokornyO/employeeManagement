import React from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import Loading from "../../loading/Loading";
import { LeaderboardStatistics } from "../../../types/statistic";
import locale from "../../../locale/cs.json";

interface LeaderboardTableProps {
    data: LeaderboardStatistics[] | null;
    isLoading: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return <Loading />;
    }

    return (
        <Box m={2} sx={{ width: { xs: "100%", md: "90%", xl: "80%" }, margin: "auto" }}>
            <Typography variant="h6" align="center" mb={2}>
                {locale.LEADERBOARD}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{locale.POSITION}</TableCell>
                            <TableCell>{locale.USER}</TableCell>
                            <TableCell align="right">{locale.COMPLETED_TASKS}</TableCell>
                            <TableCell align="right">{locale.WORKED_HOURS}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data!.map((user, index) => (
                            <TableRow key={user.appuser.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    {user.appuser.firstName} {user.appuser.surname}
                                </TableCell>
                                <TableCell align="right">{user.completedTasks}</TableCell>
                                <TableCell align="right">{user.workedHours}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default LeaderboardTable;
