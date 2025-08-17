import React from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import Login from "../../components/login/Login.tsx";
import locale from "../../locale/cs.json";

const LoginPage: React.FC = () => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{locale.LOGIN}</title>
            </Helmet>
            <Login />
        </HelmetProvider>
    );
}

export default LoginPage;