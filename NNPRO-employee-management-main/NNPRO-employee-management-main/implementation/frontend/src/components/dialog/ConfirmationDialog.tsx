import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import locale from "../../locale/cs.json";

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
   open,
   onClose,
   onConfirm,
   title,
   message,
   confirmButtonText = locale.DELETE,
   cancelButtonText = locale.CANCEL
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
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
            <DialogContent
                sx={{
                    padding: 4,
                    paddingTop: '32px !important',
                    bgcolor: "background.default",
                    color: "text.primary"
                }}
            >
                {message}
            </DialogContent>

            <DialogActions sx={{ padding: 3, justifyContent: "flex-end", bgcolor: "background.default" }}>
                <Button onClick={onClose} variant="outlined" sx={{ color: "gray" }}>
                    {cancelButtonText}
                </Button>
                <Button onClick={onConfirm} color="primary" variant="contained" sx={{ marginLeft: 2 }}>
                    {confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
