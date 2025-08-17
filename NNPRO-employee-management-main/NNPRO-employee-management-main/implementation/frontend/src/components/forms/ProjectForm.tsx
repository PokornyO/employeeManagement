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
import { Project, Status } from "../../types/project.ts";
import { getDayWithOffset, toIsoDate } from "../../utils/date.ts";
import { useAuth } from "../providers/AuthProvider.tsx";
import locale from "../../locale/cs.json";

const ProjectSchema = Yup.object().shape({
    name: Yup.string().required(locale.TITLE_REQUIRED),
    description: Yup.string().required(locale.DESCRIPTION_REQUIRED),
    dueDate: Yup.date()
        .required(locale.DUE_DATE_REQUIRED)
        .min(new Date(), locale.DUE_DATE_FUTURE),
    status: Yup.object({
        name: Yup.string().required(locale.STATUS_REQUIRED),
        label: Yup.string().required(),
    }).required(locale.STATUS_REQUIRED),
});

interface ProjectFormProps {
    initialValues?: Partial<Project>;
    onSubmit: (project: Project) => void;
    statuses: Status[];
    error?: string | null;
    submitButtonText?: string;
}

interface ProjectFormValues {
    name: string;
    description: string;
    dueDate: string;
    status: Status;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
     initialValues = {
         name: "",
         description: "",
         dueDate: "",
         status: undefined,
     },
     onSubmit,
     error,
     statuses,
     submitButtonText = locale.ADD,
}) => {
    const { user } = useAuth();

    if (statuses.length === 0) {
        error = locale.ERROR_LOADING_STATUSES;
    }

    const initialStatus = initialValues.status || statuses[0];

    return (
        <Formik<ProjectFormValues>
            initialValues={{
                name: initialValues.name ?? "",
                description: initialValues.description ?? "",
                dueDate: initialValues.dueDate
                    ? toIsoDate(new Date(initialValues.dueDate))
                    : "",
                status: initialStatus,
            }}
            validationSchema={ProjectSchema}
            onSubmit={(values, { setSubmitting }) => {
                const newProject: Project = {
                    id: initialValues.id ?? 0,
                    name: values.name,
                    description: values.description,
                    dueDate: values.dueDate,
                    status: values.status,
                    leader: user!,
                };
                onSubmit(newProject);
                setSubmitting(false);
            }}
        >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                <DialogFormContainer>
                    <Form style={{ width: "100%" }}>
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Field
                                name="name"
                                as={TextField}
                                label={locale.TITLE}
                                variant="outlined"
                                fullWidth
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                            />

                            <Field
                                name="description"
                                as={TextField}
                                label={locale.DESCRIPTION}
                                variant="outlined"
                                fullWidth
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                            />

                            <TextField
                                select
                                name="status"
                                label={locale.STATUS}
                                variant="outlined"
                                fullWidth
                                value={values.status?.name || ""}
                                onChange={(event) => {
                                    const selectedStatus = statuses.find(
                                        (status) => status.name === event.target.value
                                    );
                                    void setFieldValue("status", selectedStatus);
                                }}
                                error={touched.status && Boolean(errors.status)}
                                helperText={touched.status && errors.status?.name}
                            >
                                {statuses.map((status) => (
                                    <MenuItem key={status.name} value={status.name}>
                                        {status.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Field
                                name="dueDate"
                                as={TextField}
                                label={locale.DUE_DATE}
                                variant="outlined"
                                fullWidth
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: toIsoDate(getDayWithOffset(1)),
                                }}
                                error={touched.dueDate && Boolean(errors.dueDate)}
                                helperText={touched.dueDate && errors.dueDate}
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

export default ProjectForm;
