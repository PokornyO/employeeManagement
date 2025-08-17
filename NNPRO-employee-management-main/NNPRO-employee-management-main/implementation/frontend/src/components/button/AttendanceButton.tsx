import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import locale from "../../locale/cs.json";

interface AttendanceButtonProps {
    onClick: () => void;
}

const AttendanceButton: React.FC<AttendanceButtonProps> = ({ onClick }) => {
    return (
        <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={onClick}
            sx={{
                backgroundColor: "#2E7D32",
                color: "#fff",
                '&:hover': {
                    backgroundColor: "#1B5E20",
                },
            }}
        >
            {locale.ADD_ATTENDANCE}
        </Button>
    );
};

export default AttendanceButton;
