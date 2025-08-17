import React from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import locale from "../../locale/cs.json";
import {FormContainer} from "../../styles/layout/form/form.ts";

const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required(locale.CURRENT_PASSWORD_REQUIRED),
    newPassword: Yup.string()
        .required(locale.NEW_PASSWORD_REQUIRED)
        .min(8, locale.PASSWORD_MIN_8_CHARACTERS)
        .matches(/[A-Z]/, locale.PASSWORD_MUST_CONTAIN_UPPERCASE)
        .matches(/\d/, locale.PASSWORD_MUST_CONTAIN_NUMBER)
        .matches(/[!@#$%^&*]/, locale.PASSWORD_MUST_CONTAIN_SPECIAL_CHARACTER),
    confirmNewPassword: Yup.string()
        .required(locale.CONFIRM_PASSWORD_REQUIRED)
        .oneOf([Yup.ref('newPassword')], locale.PASSWORDS_DO_NOT_MATCH),
});

interface ChangePasswordFormProps {
    onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
    error?: string | null;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSubmit, error }) => {
    return (
        <Formik
            initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            }}
            validationSchema={ChangePasswordSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                onSubmit(values.currentPassword, values.newPassword)
                    .then(() => {
                        resetForm();
                    })
                    .finally(() => {
                        setSubmitting(false);
                    });
            }}
        >
            {({ errors, touched, isSubmitting, handleChange }) => (
                <FormContainer>
                    <Form>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Typography variant="h6" gutterBottom>
                                Změna hesla
                            </Typography>
                            <Field
                                name="currentPassword"
                                as={TextField}
                                label={locale.CURRENT_PASSWORD}
                                variant="outlined"
                                type="password"
                                fullWidth
                                error={
                                    touched.currentPassword &&
                                    Boolean(errors.currentPassword)
                                }
                                helperText={
                                    touched.currentPassword && errors.currentPassword
                                }
                                onChange={handleChange}
                            />
                            <Field
                                name="newPassword"
                                as={TextField}
                                label={locale.NEW_PASSWORD}
                                variant="outlined"
                                type="password"
                                fullWidth
                                error={
                                    touched.newPassword && Boolean(errors.newPassword)
                                }
                                helperText={touched.newPassword && errors.newPassword}
                                onChange={handleChange}
                            />
                            <Field
                                name="confirmNewPassword"
                                as={TextField}
                                label={locale.CONFIRM_PASSWORD}
                                variant="outlined"
                                type="password"
                                fullWidth
                                error={
                                    touched.confirmNewPassword &&
                                    Boolean(errors.confirmNewPassword)
                                }
                                helperText={
                                    touched.confirmNewPassword && errors.confirmNewPassword
                                }
                                onChange={handleChange}
                            />

                            {error && (
                                <Typography color="error" variant="body2">
                                    {error}
                                </Typography>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                            >
                                {locale.CHANGE_PASSWORD}
                            </Button>
                        </Box>
                    </Form>
                </FormContainer>
            )}
        </Formik>
    );
};

export default ChangePasswordForm;
