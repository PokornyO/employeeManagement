import React from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import ContentHolder from "../../components/containers/ContentHolder.tsx";
import locale from "../../locale/cs.json";
import CommentManagement from "../../components/comment/CommentManagement.tsx";

const CommentPage: React.FC = () => {

    return (
        <HelmetProvider>
            <Helmet>
                <title>{locale.COMMENT}</title>
            </Helmet>
            <ContentHolder title={locale.COMMENT}>
                <CommentManagement/>
            </ContentHolder>
        </HelmetProvider>
    );

};

export default CommentPage;