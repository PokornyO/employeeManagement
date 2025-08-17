import React from "react";
import { Box } from "@mui/material";
import {ProviderProps} from "../../types/layout.ts";

const LayoutWrapper: React.FC<ProviderProps> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            {children}
        </Box>
    );
};

export default LayoutWrapper;