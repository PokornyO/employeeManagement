import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "../../pages/public/LoginPage.tsx";

const PublicRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default PublicRouter;