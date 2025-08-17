import React from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import ContentHolder from "../../components/containers/ContentHolder.tsx";
import {useProject} from "../../components/providers/ProjectProvider.tsx";
import locale from "../../locale/cs.json";
import StatisticManagement from "../../components/statistic/StatisticManagement.tsx";

const StatPage: React.FC = () => {
    const { project } = useProject();

    return (
        <HelmetProvider>
            <Helmet>
                <title>{locale.STATISTICS} - {project?.name}</title>
            </Helmet>
            <ContentHolder title={locale.STATISTICS}>
                <StatisticManagement />
            </ContentHolder>
        </HelmetProvider>
    );

};

export default StatPage;
