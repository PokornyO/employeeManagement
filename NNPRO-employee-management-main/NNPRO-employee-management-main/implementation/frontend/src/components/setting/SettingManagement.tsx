import React, {useState} from "react";
import ChangePasswordForm from "../forms/ChangePasswordForm.tsx";
import {changePasswordRequest} from "../../services/authService.ts";
import {toast} from "react-toastify";

const SettingManagement: React.FC = () => {

    const [changePasswordError, setChangePasswordError] = useState<string | null>(null);

    const handleChangePasswordSubmit = async (currentPassword: string, newPassword: string) => {
        const response = await changePasswordRequest(currentPassword, newPassword);

        if (response.success) {
            setChangePasswordError(null);
            toast.success("Heslo bylo úspěšně změněno.");
        } else {
            setChangePasswordError(response.message!);
        }
    }

    return (
        <ChangePasswordForm onSubmit={handleChangePasswordSubmit} error={changePasswordError} />
    );
}

export default SettingManagement;