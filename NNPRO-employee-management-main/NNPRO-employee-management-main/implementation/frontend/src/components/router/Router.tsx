import React from "react";
import {useAuth} from "../providers/AuthProvider.tsx";
import {Route, Routes} from "react-router-dom";
import PrivateRouter from "./PrivateRouter.tsx";
import PublicRouter from "./PublicRouter.tsx";

const Router: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/*" element={isAuthenticated ? <PrivateRouter /> : <PublicRouter />} />
        </Routes>
    );
}

export default Router;