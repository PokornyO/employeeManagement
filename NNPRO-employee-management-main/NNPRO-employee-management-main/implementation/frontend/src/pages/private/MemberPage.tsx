import React from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import ContentHolder from "../../components/containers/ContentHolder.tsx";
import MemberManagement from "../../components/member/MemberManagement.tsx";
import {useProject} from "../../components/providers/ProjectProvider.tsx";
import locale from "../../locale/cs.json";

const MemberPage: React.FC = () => {
    const { project } = useProject();
    return (
        <HelmetProvider>
            <Helmet>
                <title>{locale.MEMBERS} - {project?.name}</title>
            </Helmet>
            <ContentHolder title={locale.MEMBERS}>
                <MemberManagement />
            </ContentHolder>
        </HelmetProvider>
    );

};

export default MemberPage;
