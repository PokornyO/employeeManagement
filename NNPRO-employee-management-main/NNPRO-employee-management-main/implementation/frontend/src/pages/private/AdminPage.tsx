import React from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import locale from "../../locale/cs.json";
import ContentHolder from "../../components/containers/ContentHolder.tsx";
import AdminUserManagement from "../../components/admin/AdminUserManagement.tsx";

const AdminPage: React.FC = () => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{locale.ADMIN_PANEL}</title>
            </Helmet>
            <ContentHolder title={locale.ADMIN_PANEL}>
                <AdminUserManagement />
            </ContentHolder>
        </HelmetProvider>
    );
};

export default AdminPage;