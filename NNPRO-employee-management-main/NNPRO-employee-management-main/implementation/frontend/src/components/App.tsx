import React from "react";
import ThemeProvider from "./providers/ThemeProvider.tsx";
import StyleProvider from "./providers/StyleProvider.tsx";
import {ToastProvider} from "./providers/ToastProvider.tsx";
import AuthProvider from "./providers/AuthProvider.tsx";
import {BrowserRouter} from "react-router-dom";
import Router from "./router/Router.tsx";

const App: React.FC = () => {

    return (
        <ThemeProvider>
            <StyleProvider>
                <ToastProvider>
                    <BrowserRouter>
                        <AuthProvider>
                            <Router />
                        </AuthProvider>
                    </BrowserRouter>
                </ToastProvider>
            </StyleProvider>
        </ThemeProvider>
    );
};

export default App
