import React, { ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const ModalDialog: React.FC<ModalDialogProps> = ({ open, onClose, title, children }) => {
    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: 2,
                        boxShadow: 0,
                        backgroundColor: 'background.default',
                    },
                }}
        >
            <DialogTitle
                sx={{
                    bgcolor: "primary.main",
                    color: "text",
                    textAlign: "center",
                }}
            >
                {title}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "#fff",
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: 4, bgcolor: "background.default", color: "text.primary" }}>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default ModalDialog;
