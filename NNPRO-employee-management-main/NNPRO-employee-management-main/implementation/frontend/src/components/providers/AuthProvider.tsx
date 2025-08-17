import React, {createContext, useEffect, useMemo, useState} from "react";
import {ProviderProps} from "../../types/layout";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {AuthContextType, User} from "../../types/auth.ts";
import Loading from "../loading/Loading.tsx";
import {Role, ROLES} from "../../types/role.ts";
import locale from "../../locale/cs.json";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<ProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsAuthenticated(false);
        const user = localStorage.getItem("user_data");
        if (user) {
            const parsedUser = JSON.parse(user);
            setIsAuthenticated(true);
            setUser(parsedUser);
        }
        setLoading(false);
    }, [navigate]);

    const login = (user: User) => {
        setIsAuthenticated(false);
        localStorage.setItem("user_data", JSON.stringify(user));
        setIsAuthenticated(true);
        setUser(user);
        toast.success(locale.SUCCESSFUL_LOGIN);
    };

    const logout = () => {
        localStorage.removeItem("user_data");
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login");
        toast.info(locale.SUCCESSFUL_LOGOUT);
    };

    const hasAccess = (requiredRole: Role): boolean => {
        return (ROLES[user?.role as Role] || 0) >= (ROLES[requiredRole] || 0);
    };

    const context = useMemo(() => ({
        isAuthenticated,
        user,
        login,
        logout,
        hasAccess,
    }), [isAuthenticated]);

    if (loading) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}