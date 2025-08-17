import React from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import ContentHolder from "../../components/containers/ContentHolder.tsx";
import locale from "../../locale/cs.json";
import AssessmentManagement from "../../components/assessment/AssessmentManagement.tsx";

const AssessmentPage: React.FC = () => {

    return (
        <HelmetProvider>
            <Helmet>
                <title>{locale.ASSESSMENT}</title>
            </Helmet>
            <ContentHolder title={locale.ASSESSMENT}>
                <AssessmentManagement/>
            </ContentHolder>
        </HelmetProvider>
    );

};

export default AssessmentPage;