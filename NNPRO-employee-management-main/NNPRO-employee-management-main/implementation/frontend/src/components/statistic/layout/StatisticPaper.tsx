import React from "react";
import { Box } from "@mui/material";
import {ProviderProps} from "../../../types/layout.ts";
import {useTheme} from "styled-components";

const StatisticPaper: React.FC<ProviderProps> = ({ children }) => {
    const theme = useTheme();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            borderRadius={2}
            p={2}
            width={300}
            height={300}
            m={2}
            sx={{ bgcolor: theme.secondary }}
        >
            {children}
        </Box>
    );
};

export default StatisticPaper;