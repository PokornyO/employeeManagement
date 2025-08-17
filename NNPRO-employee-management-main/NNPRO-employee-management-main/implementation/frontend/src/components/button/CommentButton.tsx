import React from "react";
import { Button } from "@mui/material";
import locale from "../../locale/cs.json";

interface CommentButtonProps {
    onClick: () => void;
}

const CommentButton: React.FC<CommentButtonProps> = ({ onClick }) => {
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
            {locale.COMMENT}
        </Button>
    );
};

export default CommentButton;
