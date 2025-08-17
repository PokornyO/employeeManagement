import React from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {CenteredFormContainer} from "../../styles/layout/form/form.ts";
import locale from "../../locale/cs.json";

const LoginSchema = Yup.object().shape({
    username: Yup.string().required(locale.USERNAME_REQUIRED),
    password: Yup.string().required(locale.PASSWORD_REQUIRED),
});

interface LoginFormProps {
    onSubmit: (values: { username: string; password: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ errors, touched, isSubmitting, handleChange }) => (
                <CenteredFormContainer>
                    <Form>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Typography variant="h5" align="center" gutterBottom>
                                Přihlášení
                            </Typography>
                            <Field
                                name="username"
                                as={TextField}
                                label={locale.USERNAME}
                                variant="outlined"
                                fullWidth
                                error={touched.username && Boolean(errors.username)}
                                helperText={touched.username && errors.username}
                                onChange={handleChange}
                            />
                            <Field
                                name="password"
                                as={TextField}
                                label={locale.PASSWORD}
                                variant="outlined"
                                type="password"
                                fullWidth
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                onChange={handleChange}
                            />
                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                {locale.LOG_IN}
                            </Button>
                        </Box>
                    </Form>
                </CenteredFormContainer>
            )}
        </Formik>
    );
};

export default LoginForm;
