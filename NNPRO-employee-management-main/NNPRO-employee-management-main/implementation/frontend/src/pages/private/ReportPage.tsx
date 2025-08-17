import React from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import ContentHolder from "../../components/containers/ContentHolder.tsx";
import {useProject} from "../../components/providers/ProjectProvider.tsx";
import locale from "../../locale/cs.json";
import ReportManagement from "../../components/report/ReportManagement.tsx";

const ReportPage: React.FC = () => {
    const { project } = useProject();

    return (
        <HelmetProvider>
            <Helmet>
                <title>{locale.REPORTS} - {project?.name}</title>
            </Helmet>
            <ContentHolder title={locale.REPORTS}>
                <ReportManagement />
            </ContentHolder>
        </HelmetProvider>
    );

};

export default ReportPage;
