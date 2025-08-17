import React, {useEffect, useState} from "react";
import AddButton from "../button/AddButton";
import ProjectForm from "../forms/ProjectForm";
import ModalDialog from "../dialog/ModalDialog";
import { Box } from "@mui/material";
import {Project, ProjectsResponse, Status} from "../../types/project";
import {
    createProject,
    deleteProject,
    getAllProjects,
    getAllUserProjects, getProjectStatuses,
    updateProject,
} from "../../services/projectService";
import { toast } from "react-toastify";
import locale from "../../locale/cs.json";
import ProjectList from "./ProjectList";
import { useAuth } from "../providers/AuthProvider";
import { Role } from "../../types/role";
import Loading from "../loading/Loading.tsx";

const ProjectManagement: React.FC = () => {
    const { user, hasAccess } = useAuth();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [addError, setAddError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getProjectStatuses()
            .then((response) => {
                if (response.success) {
                    setStatuses(response.statuses!);
                }
            }).finally(() => {
                setLoading(false);
            });
    }, []);

    const handleAddProjectClick = () => {
        setIsAddDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsAddDialogOpen(false);
        setAddError(null);
    };

    const handleCreateProject = async (project: Project) => {
        const response = await createProject(project, user!);

        if (response.success) {
            toast.success(locale.PROJECT_SUCCESSFULLY_CREATED);
            setIsAddDialogOpen(false);
            setRefreshKey((prev) => prev + 1);
        } else {
            setAddError(response.message ?? locale.ERROR_CREATING_PROJECT);
        }
    };

    const handleUpdateProject = async (updatedProject: Project): Promise<ProjectsResponse> => {
        const response = await updateProject(updatedProject, user!);
        if (response.success) {
            toast.success(locale.PROJECT_SUCCESSFULLY_UPDATED);
            setRefreshKey((prev) => prev + 1);
        } else {
            toast.error(response.message ?? locale.ERROR_UPDATE_PROJECT);
        }
        return response;
    };

    const handleDeleteProject = async (projectId: number) => {
        const response = await deleteProject(projectId);
        if (response.success) {
            toast.success(locale.PROJECT_SUCCESSFULLY_DELETED);
            setRefreshKey((prev) => prev + 1);
        } else {
            toast.error(response.message ?? locale.ERROR_DELETE_PROJECT);
        }
    };

    const fetchProjects = async (page: number, size: number) => {
        let response;

        if (hasAccess(Role.ADMIN)) {
            response = await getAllProjects(page, size);
        } else {
            response = await getAllUserProjects(user!.id, page, size);
        }

        if (response.success) {
            return {
                items: response.projects ?? [],
                totalPages: response.pagination?.totalPages ?? 0,
            };
        } else {
            toast.error(response.message ?? locale.ERROR_LOADING_PROJECTS);
            return { items: [], totalPages: 0 };
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {hasAccess(Role.LEADER) && (
                <Box sx={{ marginBottom: 2 }}>
                    <AddButton onClick={handleAddProjectClick} />
                </Box>
            )}
            <ModalDialog
                open={isAddDialogOpen}
                onClose={handleDialogClose}
                title={locale.NEW_PROJECT}
            >
                <ProjectForm statuses={statuses} onSubmit={handleCreateProject} error={addError} />
            </ModalDialog>
            <ProjectList
                fetchProjects={fetchProjects}
                statuses={statuses}
                onUpdate={handleUpdateProject}
                onDelete={handleDeleteProject}
                refreshKey={refreshKey}
            />
        </>
    );
};

export default ProjectManagement;
