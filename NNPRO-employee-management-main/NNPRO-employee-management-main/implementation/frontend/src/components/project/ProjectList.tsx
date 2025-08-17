import React, { useState } from "react";
import {
    Box,
    ListItem,
    IconButton,
    Typography,
    Divider,
} from "@mui/material";
import { AccessTime, Edit, Delete } from "@mui/icons-material";
import {Project, ProjectResponse, Status} from "../../types/project";
import ModalDialog from "../dialog/ModalDialog";
import locale from "../../locale/cs.json";
import { isUserProjectLeader } from "../../services/projectService";
import { useAuth } from "../providers/AuthProvider";
import PaginatedList from "../pagination/PaginatedList";
import ProjectForm from "../forms/ProjectForm";
import { Role } from "../../types/role";
import { NavLink } from "react-router-dom";
import { useTheme } from "styled-components";
import ConfirmationDialog from "../dialog/ConfirmationDialog.tsx";
import {getColorByStatus} from "../../utils/color.ts";

interface ProjectListProps {
    fetchProjects: (page: number, size: number) => Promise<{items: Project[]; totalPages: number;}>;
    statuses: Status[];
    onUpdate: (project: Project) => Promise<ProjectResponse>;
    onDelete: (projectId: number) => void;
    refreshKey: number;
}

const ProjectList: React.FC<ProjectListProps> = ({
     fetchProjects,
     statuses,
     onUpdate,
     onDelete,
     refreshKey,
}) => {
    const { user, hasAccess } = useAuth();
    const theme = useTheme();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [editError, setEditError] = useState<string | null>(null);

    const handleEditClick = (project: Project) => {
        setSelectedProject(project);
        setEditError(null);
        setIsEditDialogOpen(true);
    };

    const handleDeleteClick = (project: Project) => {
        setSelectedProject(project);
        setIsDeleteDialogOpen(true);
    };

    const handleEditSubmit = async (updatedProject: Project) => {
        const response = await onUpdate(updatedProject);
        if (response.success) {
            setIsEditDialogOpen(false);
        } else {
            setEditError(response.message ?? locale.ERROR_UPDATE_PROJECT);
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedProject) {
            onDelete(selectedProject.id);
        }
        setIsDeleteDialogOpen(false);
    };


    const renderProjectItem = (project: Project) => (
        <Box key={project.id}>
            <ListItem
                sx={{
                    display: "flex",
                    alignItems: "center",
                    paddingY: 2,
                    gap: 5,
                    justifyContent: "space-between",
                    backgroundColor: theme.secondary,
                    color: theme.text,
                    "&:hover": {
                        backgroundColor: theme.primaryLight,
                    },
                }}
            >
                <NavLink
                    to={`/projects/${project.id}/tasks`}
                    style={{
                        flex: 1,
                        textDecoration: "none",
                        color: theme.text,
                    }}
                >
                    <Typography variant="body1">{project.name}</Typography>
                    <Typography variant="body2" sx={{ color: "gray", marginTop: 0.5 }}>
                        {project.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: getColorByStatus(project.status.name, project.dueDate), marginTop: 0.5 }}>
                        {project.status.label}
                    </Typography>
                    <Box sx={{ display: "flex", color: getColorByStatus(project.status.name, project.dueDate), alignItems: "center", gap: 1, marginTop: 0.5 }}>
                        <AccessTime fontSize="small" />
                        <Typography variant="body2">
                            {new Date(project.dueDate).toLocaleDateString("cs-CZ")}
                        </Typography>
                    </Box>
                </NavLink>

                {(hasAccess(Role.ADMIN) || isUserProjectLeader(project, user!)) && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => handleEditClick(project)}>
                            <Edit sx={{ color: theme.text }} />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(project)}>
                            <Delete sx={{ color: theme.text }} />
                        </IconButton>
                    </Box>
                )}
            </ListItem>
            <Divider />
        </Box>
    );

    return (
        <>
            <PaginatedList
                fetchData={fetchProjects}
                renderItem={renderProjectItem}
                pageSize={20}
                refreshKey={refreshKey}
            />
            <ModalDialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                title={locale.EDIT_PROJECT}
            >
                {selectedProject && (
                    <ProjectForm
                        statuses={statuses}
                        initialValues={{
                            id: selectedProject.id,
                            name: selectedProject.name,
                            description: selectedProject.description,
                            dueDate: selectedProject.dueDate,
                            status: selectedProject.status,
                        }}
                        onSubmit={handleEditSubmit}
                        submitButtonText={locale.SAVE_CHANGES}
                        error={editError}
                    />
                )}
            </ModalDialog>

            <ConfirmationDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={locale.DELETE_CONFIRMATION}
                message={`${locale.DELETE_PROJECT_CONFIRMATION} "${selectedProject?.name}"?`}
                confirmButtonText={locale.DELETE}
                cancelButtonText={locale.CANCEL}
            />
        </>
    );
};

export default ProjectList;
