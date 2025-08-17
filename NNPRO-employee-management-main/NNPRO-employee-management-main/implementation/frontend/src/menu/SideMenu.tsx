import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Drawer, useMediaQuery } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {NavLink, useMatch} from "react-router-dom";
import { useTheme } from "styled-components";
import { SideMenuStyle } from "../styles/menu/menu.ts";
import locale from "../locale/cs.json"

interface SideMenuProps {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ mobileOpen, handleDrawerToggle }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery("(max-width:900px)");

    const match = useMatch("/projects/:projectId/*");
    const projectId = match?.params.projectId;
    const basePath = `/projects/${projectId}`;

    const menuItems = [
        { title: locale.TASKS, path: `${basePath}/tasks`, icon: <AssignmentIcon /> },
        { title: locale.MEMBERS, path: `${basePath}/members`, icon: <GroupIcon /> },
        { title: locale.STATISTICS, path: `${basePath}/stats`, icon: <BarChartIcon /> },
        { title: locale.REPORTS, path: `${basePath}/reports`, icon: <InsertDriveFileIcon /> },
        { title: locale.CALENDAR, path: `${basePath}/calendar`, icon: <CalendarTodayIcon /> },
    ];

    const menuContent = (
        <SideMenuStyle>
            <List>
                {menuItems.map((item, index) => (
                    <ListItemButton
                        key={index}
                        component={NavLink}
                        to={item.path}
                        sx={{
                            '&.active': {
                                backgroundColor: theme.primaryLight,
                            }
                        }}
                        onClick={isMobile ? handleDrawerToggle : undefined}
                    >
                        <ListItemIcon sx={{ color: theme.text }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.title} sx={{ color: theme.text }} />
                    </ListItemButton>
                ))}
            </List>
        </SideMenuStyle>
    );

    return isMobile ? (
        <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{ display: { xs: 'block', md: 'none' } }}
            ModalProps={{ keepMounted: true }}
        >
            {menuContent}
        </Drawer>
    ) : (
        menuContent
    );
};

export default SideMenu;
