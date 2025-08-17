import React from "react";
import { Box } from "@mui/material";
import {ProviderProps} from "../../types/layout.ts";

const ContentWrapper: React.FC<ProviderProps> = ({ children }) => {
    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                padding: { xs: 0, sm: 3 },
                overflowY: 'auto',
            }}
        >
            {children}
        </Box>
    );
};

export default ContentWrapper;