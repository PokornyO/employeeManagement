import React from "react";
import { Button } from "@mui/material";
import locale from "../../locale/cs.json";

interface AssessmentButtonProps {
    onClick: () => void;
}

const AssessmentButton: React.FC<AssessmentButtonProps> = ({ onClick }) => {
    return (
        <Button
            variant="contained"
            color="success"
            onClick={onClick}
            sx={{
                backgroundColor: "#2E7D32",
                color: "#fff",
                '&:hover': {
                    backgroundColor: "#1B5E20",
                },
            }}
        >
            {locale.ASSESSMENT}
        </Button>
    );
};

export default AssessmentButton;
