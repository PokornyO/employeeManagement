import React from "react";
import {
    Button,
    TextField,
    Box,
    Typography,
    MenuItem,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { DialogFormContainer } from "../../styles/mui/container/container.ts";
import { Role } from "../../types/role.ts";
import locale from "../../locale/cs.json";

const UserSchema = Yup.object().shape({
    username: Yup.string().required(locale.USERNAME_REQUIRED).min(3, locale.USERNAME_MIN_LENGTH).max(20, locale.USERNAME_MAX_LENGTH),
    password: Yup.string().required(locale.PASSWORD_REQUIRED).min(6, locale.PASSWORD_MIN_6_CHARACTERS),
    email: Yup.string().email(locale.INVALID_EMAIL).required(locale.EMAIL_REQUIRED),
    role: Yup.string().required(locale.ROLE_REQUIRED),
    firstName: Yup.string().required(locale.FIRST_NAME_REQUIRED),
    surname: Yup.string().required(locale.SURNAME_REQUIRED),
    phoneNumber: Yup.string()
        .matches(/^\d+$/, locale.PHONE_NUMBER_INVALID)
        .required(locale.PHONE_NUMBER_REQUIRED),
});

interface UserAddFormProps {
    initialValues?: Partial<UserFormValues>;
    onSubmit: (user: UserFormValues) => void;
    roles: Role[];
    error?: string | null;
    submitButtonText?: string;
}

interface UserFormValues {
    username: string;
    password: string;
    email: string;
    role: string;
    firstName: string;
    surname: string;
    phoneNumber: string;
}

const UserAddForm: React.FC<UserAddFormProps> = ({
                                                     initialValues = {
                                                         username: "",
                                                         password: "",
                                                         email: "",
                                                         role: "",
                                                         firstName: "",
                                                         surname: "",
                                                         phoneNumber: "",
                                                     },
                                                     onSubmit,
                                                     error,
                                                     roles,
                                                     submitButtonText = locale.ADD_USER,
                                                 }) => {
                                                    const initialRole = initialValues.role ?? roles[0];
    return (
        <Formik<UserFormValues>
            initialValues={{
                ...initialValues,
                role: initialRole,
            }}
            validationSchema={UserSchema}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                <DialogFormContainer>
                    <Form style={{ width: "100%" }}>
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Field
                                name="username"
                                as={TextField}
                                label={locale.USERNAME}
                                variant="outlined"
                                fullWidth
                                error={touched.username && Boolean(errors.username)}
                                helperText={touched.username && errors.username}
                            />

                            <Field
                                name="password"
                                as={TextField}
                                label={locale.PASSWORD}
                                variant="outlined"
                                fullWidth
                                type="password"
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                            />

                            <Field
                                name="email"
                                as={TextField}
                                label={locale.EMAIL}
                                variant="outlined"
                                fullWidth
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                            />

                            <TextField
                                select
                                name="role"
                                label={locale.ROLE}
                                variant="outlined"
                                fullWidth
                                value={values.role}
                                onChange={(event) => setFieldValue("role", event.target.value)}
                                error={touched.role && Boolean(errors.role)}
                                helperText={touched.role && errors.role}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Field
                                name="firstName"
                                as={TextField}
                                label={locale.FIRST_NAME}
                                variant="outlined"
                                fullWidth
                                error={touched.firstName && Boolean(errors.firstName)}
                                helperText={touched.firstName && errors.firstName}
                            />

                            <Field
                                name="surname"
                                as={TextField}
                                label={locale.SURNAME}
                                variant="outlined"
                                fullWidth
                                error={touched.surname && Boolean(errors.surname)}
                                helperText={touched.surname && errors.surname}
                            />

                            <Field
                                name="phoneNumber"
                                as={TextField}
                                label={locale.PHONE_NUMBER}
                                variant="outlined"
                                fullWidth
                                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                                helperText={touched.phoneNumber && errors.phoneNumber}
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
                                {submitButtonText}
                            </Button>
                        </Box>
                    </Form>
                </DialogFormContainer>
            )}
        </Formik>
    );
};

export default UserAddForm;
