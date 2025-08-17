import React from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import ContentHolder from "../../components/containers/ContentHolder.tsx";
import locale from "../../locale/cs.json";
import SettingManagement from "../../components/setting/SettingManagement.tsx";

const SettingPage: React.FC = () => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{locale.SETTINGS}</title>
            </Helmet>
            <ContentHolder title={locale.SETTINGS}>
                <SettingManagement />
            </ContentHolder>
        </HelmetProvider>
    );

};

export default SettingPage;
