import React from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import ContentHolder from "../../components/containers/ContentHolder.tsx";
import locale from "../../locale/cs.json";
import TaskProcessorsManagement from "../../components/taskProcessors/TaskProcessorsManagement.tsx";

const TaskProcessorsPage: React.FC = () => {

    return (
        <HelmetProvider>
            <Helmet>
                <title>{locale.PROCESSORS}</title>
            </Helmet>
            <ContentHolder title={locale.PROCESSORS}>
                <TaskProcessorsManagement />
            </ContentHolder>
        </HelmetProvider>
    );

};

export default TaskProcessorsPage;
