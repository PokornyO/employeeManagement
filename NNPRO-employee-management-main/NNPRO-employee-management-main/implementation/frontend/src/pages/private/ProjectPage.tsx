import React from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import ContentHolder from "../../components/containers/ContentHolder.tsx";
import ProjectManagement from "../../components/project/ProjectManagement.tsx";
import locale from "../../locale/cs.json";

const ProjectPage: React.FC = () => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{locale.PROJECTS}</title>
            </Helmet>
            <ContentHolder title={locale.PROJECTS}>
                <ProjectManagement />
            </ContentHolder>
        </HelmetProvider>
    );

};

export default ProjectPage;
