import React from "react";
import { Box } from "@mui/material";
import {ProviderProps} from "../../../types/layout.ts";

const StatisticSectionWrapper: React.FC<ProviderProps> = ({ children }) => {
    return (
        <Box
            display="flex"
            width="100%"
            justifyContent="space-around"
            alignItems="center"
            flexWrap="wrap"
        >
            {children}
        </Box>
    );
};

export default StatisticSectionWrapper;