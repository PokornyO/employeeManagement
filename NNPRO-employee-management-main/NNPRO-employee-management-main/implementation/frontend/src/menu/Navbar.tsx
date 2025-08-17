import React from "react";
import {AppBar, Avatar, Box, Divider, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import { useTheme } from "styled-components";
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "../components/providers/AuthProvider";
import { Menu as MenuIcon } from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import {getRoleLabel, Role} from "../types/role.ts";
import locale from "../locale/cs.json"


interface NavbarProps {
    showSideMenu: boolean;
    handleDrawerToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ showSideMenu, handleDrawerToggle }) => {
    const theme = useTheme();
    const { logout, user, hasAccess } = useAuth();
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: theme.primary }}>
            <Toolbar>
                {showSideMenu && (
                    <IconButton
                        color="inherit"
                        onClick={handleDrawerToggle}
                        sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Typography
                    component={Link}
                    to="/projects"
                    variant="h6"
                    noWrap
                    sx={{
                        flexGrow: 1,
                        ml: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    {locale.EMPLOYEE_MANAGEMENT}
                </Typography>

                <Box sx={{ flexGrow: 0 }}>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar />
                    </IconButton>
                    <Menu
                        sx={{
                            mt: '45px',
                            '& .MuiPaper-root': {
                                backgroundColor: theme.secondary,
                            }
                        }}
                        anchorEl={anchorElUser}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <Box>
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography variant="body2" color="text">
                                    {user?.username}
                                </Typography>
                                <Typography variant="body2" color="text">
                                    {user?.email}
                                </Typography>
                                {user?.firstName && user?.surname && (
                                    <Typography variant="body2" color="text">
                                        {user.firstName} {user.surname}
                                    </Typography>
                                )}
                                {user?.phoneNumber && (
                                    <Typography variant="body2" color="text">
                                        {user.phoneNumber}
                                    </Typography>
                                )}
                                <Typography variant="body2" color="text">
                                    {getRoleLabel(user!.role)}
                                </Typography>
                            </Box>


                            <Divider/>
                            <MenuItem onClick={() => navigate("/settings")}>
                                {locale.SETTINGS}
                            </MenuItem>
                            {hasAccess(Role.ADMIN) && (
                                <>
                                    <Divider/>
                                    <MenuItem onClick={() => navigate("/admin")}>
                                        {locale.ADMIN_PANEL}
                                    </MenuItem>
                                </>
                            )}
                            <Divider/>
                            <MenuItem
                                onClick={() => {
                                    handleCloseUserMenu();
                                    logout();
                                }}
                                sx={{ color: 'red' }}
                            >
                                <LogoutIcon sx={{ mr: 1 }} />
                                {locale.LOG_OUT}
                            </MenuItem>
                        </Box>

                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
