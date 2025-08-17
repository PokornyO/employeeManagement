import {styled} from "@mui/system";
import {Box} from "@mui/material";

export const DialogFormContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    paddingBottom: 0,
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [`@media (max-width:600px)`]: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
    },
}));