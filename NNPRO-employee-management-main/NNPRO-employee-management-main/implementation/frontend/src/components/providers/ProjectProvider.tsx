import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import { useParams } from "react-router-dom";
import {getProjectById, isUserProjectLeader} from "../../services/projectService";
import { Project } from "../../types/project.ts";
import {Typography} from "@mui/material";
import Loading from "../loading/Loading.tsx";
import {useAuth} from "./AuthProvider.tsx";
import locale from "../../locale/cs.json";

interface ProjectContextType {
    project: Project | null;
    loading: boolean;
    error: string | null;
    isProjectLeader: () => boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = (): ProjectContextType => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject must be used within a ProjectProvider");
    }
    return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (projectId) {
            setLoading(true);
            getProjectById(Number(projectId))
                .then(response => {
                    if (response.success) {
                        setProject(response.project ?? null);
                    } else {
                        setError(response.message ?? locale.ERROR_LOADING_PROJECT);
                    }
                })
                .catch(() => setError(locale.ERROR_LOADING_PROJECT))
                .finally(() => setLoading(false));
        }
    }, [projectId]);

    const isProjectLeader = (): boolean => {
        return isUserProjectLeader(project!, user!);
    }

    const value = useMemo(() => ({
        project,
        loading,
        error,
        isProjectLeader,
    }), [project, loading, error]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Typography variant="body1" color="error">{error}</Typography>;
    }

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};
