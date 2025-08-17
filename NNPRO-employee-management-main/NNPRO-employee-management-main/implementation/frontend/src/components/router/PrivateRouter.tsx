import React, {useState} from "react";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import ProjectPage from "../../pages/private/ProjectPage.tsx";
import TaskPage from "../../pages/private/TaskPage.tsx";
import Navbar from '../../menu/Navbar';
import SideMenu from "../../menu/SideMenu";
import StatPage from "../../pages/private/StatPage.tsx";
import MemberPage from "../../pages/private/MemberPage.tsx";
import LayoutWrapper from "../containers/LayoutWrapper.tsx";
import ContentWrapper from "../containers/ContentWrapper.tsx";
import {ProjectProvider} from "../providers/ProjectProvider.tsx";
import ReportPage from "../../pages/private/ReportPage.tsx";
import CalendarPage from "../../pages/private/CalendarPage.tsx";
import SettingPage from "../../pages/private/SettingPage.tsx";
import AdminPage from "../../pages/private/AdminPage.tsx";
import {TaskProvider} from "../providers/TaskProvider.tsx";
import AttendancePage from "../../pages/private/AttendancePage.tsx";
import { useAuth } from "../providers/AuthProvider";
import { Role } from "../../types/role";
import TaskProcessorsPage from "../../pages/private/TaskProcessorsPage.tsx";
import CommentPage from "../../pages/private/CommentPage.tsx";
import AssessmentPage from "../../pages/private/AssessmentPage.tsx";

const PrivateRouter: React.FC = () => {
    const location = useLocation();
    const { hasAccess } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const hideSideMenuPaths = ["/projects", "/settings", "/admin"];
    const showSideMenu = !hideSideMenuPaths.includes(location.pathname);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <>
            <Navbar showSideMenu={showSideMenu} handleDrawerToggle={handleDrawerToggle} />

            <LayoutWrapper>
                {showSideMenu && (
                    <SideMenu mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
                )}

                <ContentWrapper>
                    <Routes>
                        <Route path="*" element={<Navigate to="/projects" />} />
                        <Route path="/settings" element={<SettingPage />} />
                        <Route path="/projects" element={<ProjectPage />} />
                        <Route
                            path="/admin"
                            element={
                                hasAccess(Role.ADMIN) ? (
                                    <AdminPage />
                                ) : (
                                    <Navigate to="/projects" replace />
                                )
                            }
                        />
                        <Route path="/projects/:projectId/*" element={
                            <ProjectProvider>
                                <Routes>
                                    <Route path="*" element={<Navigate to="tasks" />} />
                                    <Route path="tasks" element={<TaskPage />} />
                                    <Route path="tasks/:taskId/*" element={
                                        <TaskProvider>
                                            <Routes>
                                                <Route path="*" element={<Navigate to="tasks" />} />
                                                <Route path="attendances" element={<AttendancePage />} />
                                            </Routes>
                                        </TaskProvider>
                                    } />
                                    <Route path="stats" element={<StatPage />} />
                                    <Route path="members" element={<MemberPage />} />
                                    <Route path="reports" element={<ReportPage />} />
                                    <Route path="/reports/:taskId/*" element={
                                        <TaskProvider>
                                            <Routes>
                                                <Route path="*" element={<TaskProcessorsPage />} />
                                                <Route path="comments" element={<CommentPage />} />
                                                <Route path="performance" element={<AssessmentPage />} />
                                            </Routes>
                                        </TaskProvider>
                                    } />
                                    <Route path="calendar" element={<CalendarPage />} />
                                </Routes>
                            </ProjectProvider>
                        } />
                    </Routes>
                </ContentWrapper>

            </LayoutWrapper>
        </>
    );
};

export default PrivateRouter;
