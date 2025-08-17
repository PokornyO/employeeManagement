import React, {useEffect} from "react";
import {toast, ToastContainer} from "react-toastify";
import {ProviderProps} from "../../types/layout";
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";
import {theme} from "../../constants/theme.ts";

const ToastContainerStyled = styled(ToastContainer)`
      .Toastify__toast {
        background-color: ${theme.secondary};
        color: ${theme.text};
      }
    
      .Toastify__toast-body {
        color: ${theme.text};
      }
    
      .Toastify__close-button {
        color: ${theme.text};
      }
`;

export const ToastProvider: React.FC<ProviderProps> = ({ children }) => {
    useEffect(() => {
        const toastSuccessMessage = localStorage.getItem("toast-success");
        if (toastSuccessMessage) {
            toast.success(toastSuccessMessage, {
                onClose: () => localStorage.removeItem("toast-success")
            });
        }

        const toastErrorMessage = localStorage.getItem("toast-error");
        if (toastErrorMessage) {
            toast.error(toastErrorMessage, {
                onClose: () => localStorage.removeItem("toast-error")
            });
        }
    }, []);

    return (
        <>
            <ToastContainerStyled
                position="bottom-right"
                theme="dark"
                autoClose={5000}
                hideProgressBar
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
            />
            {children}
        </>
    )
}