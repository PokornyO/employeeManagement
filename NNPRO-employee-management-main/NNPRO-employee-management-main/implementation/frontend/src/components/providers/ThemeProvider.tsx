import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React from "react";
import { ProviderProps } from "../../types/layout.ts";
import { theme } from "../../constants/theme.ts";

const muiTheme = createTheme({
    palette: {
        primary: {
            main: theme.primary,
        },
        secondary: {
            main: theme.secondary,
        },
        background: {
            default: theme.background,
        },
        text: {
            primary: theme.text,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.primaryLight,
                    color: theme.text,
                    '&:hover': {
                        backgroundColor: theme.primary,
                    },
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.secondary,
                    color: theme.text,
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.primary,
                    '& .MuiTableCell-root': {
                        color: theme.text,
                        fontWeight: 'bold',
                    },
                },
            },
        },
        MuiTableBody: {
            styleOverrides: {
                root: {
                    '& .MuiTableRow-root': {
                        backgroundColor: theme.secondary,
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: theme.primaryLight,
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: theme.text,
                    color: theme.text,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label': {
                        color: theme.text,
                    },
                    '& .MuiInputBase-input': {
                        color: theme.text,
                    },
                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.text,
                    },
                    '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.text,
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.primaryLight,
                    },
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                        filter: 'invert(1)',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: theme.text,
                    '&.Mui-focused': {
                        color: theme.primaryLight,
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: theme.text,
                    backgroundColor: theme.secondary,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.text,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.text,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.primaryLight,
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    color: theme.text,
                    backgroundColor: theme.secondary,
                },
                input: {
                    color: theme.text,
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    backgroundColor: theme.secondary,
                    color: theme.text,
                    '&:focus': {
                        backgroundColor: theme.secondary,
                    },
                },
                icon: {
                    color: theme.text,
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: theme.secondary,
                    color: theme.text,
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        color: theme.text,
                    },
                },
                popupIndicator: {
                    color: theme.text,
                },
                clearIndicator: {
                    color: theme.text,
                },
                paper: {
                    backgroundColor: theme.secondary,
                    color: theme.text,
                },
                option: {
                    '&[data-focus="true"]': {
                        backgroundColor: theme.primaryLight,
                    },
                    '&[aria-selected="true"]': {
                        backgroundColor: theme.primary,
                        color: theme.text,
                    },
                },
                noOptions: {
                    color: theme.text,
                    fontStyle: 'italic',
                },
            },
        },
    },
});

const ThemeProvider: React.FC<ProviderProps> = ({ children }) => {
    return (
        <StyledThemeProvider theme={theme}>
            <MuiThemeProvider theme={muiTheme}>
                {children}
            </MuiThemeProvider>
        </StyledThemeProvider>
    );
};

export default ThemeProvider;
