import React, { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "styled-components";

interface ContentHolderProps {
    title?: string;
    children: ReactNode;
}

const ContentHolder: React.FC<ContentHolderProps> = ({ title, children }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.background,
                borderRadius: 2,
                paddingX: 3,
                marginTop: 2,
            }}
        >
            {title && (
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    {title}
                </Typography>
            )}
            <Box sx={{ flexGrow: 1 }}>
                {children}
            </Box>
        </Box>
    );
};

export default ContentHolder;