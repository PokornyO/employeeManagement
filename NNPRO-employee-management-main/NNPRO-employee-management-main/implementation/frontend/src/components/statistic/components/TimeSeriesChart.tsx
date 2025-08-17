import React, { useState } from "react";
import { LineChart } from "@mui/x-charts";
import { Box, Typography, useMediaQuery, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import Loading from "../../loading/Loading";
import { useTheme } from "styled-components";
import { GlobalDailyStatistics } from "../../../types/statistic";
import locale from "../../../locale/cs.json";

interface TimeSeriesChartProps {
    data: GlobalDailyStatistics[] | null;
    isLoading: boolean;
    onDateRangeChange: (days: number) => void;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, isLoading, onDateRangeChange }) => {
    const theme = useTheme();

    const isSmallScreen = useMediaQuery("(max-width:700px)");
    const isMediumScreen = useMediaQuery("(max-width:1200px)");
    const [selectedRange, setSelectedRange] = useState<string>("7");

    const chartWidth = () => {
        if (isSmallScreen) {
            return 440;
        }

        if (isMediumScreen) {
            return 600;
        }

        return 800;
    }

    const chartHeight = () => {
        if (isSmallScreen) {
            return 300;
        }

        if (isMediumScreen) {
            return 350;
        }

        return 400;
    }

    const handleRangeChange = (event: SelectChangeEvent) => {
        const days = event.target.value;
        setSelectedRange(days);
        onDateRangeChange(parseInt(days, 10));
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!data || data.length === 0) {
        return <Typography align="center">{locale.NO_DATA_TO_SHOW}</Typography>;
    }

    const chartData = data.map((item) => ({
        date: new Date(item.date).getTime(),
        completedTasks: item.totalCompletedTasks || 0,
        workedHours: item.totalWorkedHours || 0,
    }));

    return (
        <Box m={2}>
            <FormControl fullWidth sx={{ mb: 3 }} variant="outlined">
                <InputLabel id="time-range-select-label">{locale.TIME_RANGE}</InputLabel>
                <Select
                    variant="outlined"
                    fullWidth
                    labelId="time-range-select-label"
                    id="time-range-select"
                    value={selectedRange}
                    onChange={handleRangeChange}
                    label={locale.TIME_RANGE}
                >
                    <MenuItem value="7">{locale.LAST_WEEK}</MenuItem>
                    <MenuItem value="14">{locale.LAST_2_WEEKS}</MenuItem>
                    <MenuItem value="30">{locale.LAST_MONTH}</MenuItem>
                    <MenuItem value="180">{locale.LAST_6_MONTHS}</MenuItem>
                    <MenuItem value="365">{locale.LAST_YEAR}</MenuItem>
                </Select>
            </FormControl>
            <Box mb={4} width="100%" display="flex" justifyContent="center">
                <Box>
                    <LineChart
                        xAxis={[
                            {
                                dataKey: "date",
                                scaleType: "time",
                                label: locale.DATE
                            },
                        ]}
                        series={[
                            {
                                dataKey: "completedTasks",
                                label: locale.COMPLETED_TASKS,
                                color: theme.success,
                                showMark: false,
                            },
                        ]}
                        dataset={chartData}
                        width={chartWidth()}
                        height={chartHeight()}
                    />
                </Box>
            </Box>
            <Box width="100%" display="flex" justifyContent="center">
                <Box>
                    <LineChart
                        xAxis={[
                            {
                                dataKey: "date",
                                scaleType: "time",
                                label: locale.DATE,
                            },
                        ]}
                        series={[
                            {
                                dataKey: "workedHours",
                                label: locale.WORKED_HOURS,
                                color: theme.primaryLight,
                                showMark: false,
                            },
                        ]}
                        dataset={chartData}
                        width={chartWidth()}
                        height={chartHeight()}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default TimeSeriesChart;
