import React from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import ContentHolder from "../../components/containers/ContentHolder.tsx";
import {useProject} from "../../components/providers/ProjectProvider.tsx";
import locale from "../../locale/cs.json";
import TaskManagement from "../../components/task/TaskManagement.tsx";

const TaskPage: React.FC = () => {
    const { project } = useProject();

    return (
        <HelmetProvider>
            <Helmet>
                <title>{locale.TASKS} - {project?.name}</title>
            </Helmet>
            <ContentHolder title={locale.TASK_LIST}>
                <TaskManagement />
            </ContentHolder>
        </HelmetProvider>
    );

};

export default TaskPage;
