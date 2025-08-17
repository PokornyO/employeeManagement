import React from "react";
import {CenteredContainerStyle} from "../../styles/layout/container/container.ts";
import LoginForm from "../forms/LoginForm.tsx";
import {toast} from "react-toastify";
import {loginRequest} from "../../services/authService.ts";
import {useAuth} from "../providers/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginSubmit = async (values: { username: string; password: string }) => {
        const response = await loginRequest(values.username, values.password);

        if (response.success && response.user) {
            login(response.user);
            navigate("/projects");
        } else {
            toast.error(response.message);
        }
    };

    return (
        <CenteredContainerStyle>
            <LoginForm onSubmit={handleLoginSubmit} />
        </CenteredContainerStyle>
    );
}

export default Login;