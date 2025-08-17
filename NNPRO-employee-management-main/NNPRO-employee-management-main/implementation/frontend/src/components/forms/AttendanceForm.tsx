import * as Yup from "yup";
import locale from "../../locale/cs.json";
import {Attendance} from "../../types/attendance.ts";
import React from "react";
import {Field, Form, Formik} from "formik";
import {toIsoDateHour} from "../../utils/date.ts";
import {DialogFormContainer} from "../../styles/mui/container/container.ts";
import {Box, Button, TextField, Typography} from "@mui/material";
import {useTask} from "../providers/TaskProvider.tsx";
import {useAuth} from "../providers/AuthProvider.tsx";

const AttendanceSchema = Yup.object().shape({
    startTime: Yup.date().required(locale.START_TIME_REQUIRED),
    endTime: Yup.date().required(locale.END_TIME_REQUIRED),
    workDescription: Yup.string().required(locale.WORK_DESCRIPTION_REQUIRED),
});

interface AttendanceFormProps {
    initialValues?: Partial<Attendance>;
    onSubmit: (attendance: Attendance) => void;
    error?: string | null;
    submitButtonText?: string;
}

interface AttendanceFormValues {
    startTime: string;
    endTime: string;
    workDescription: string;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
                                                     initialValues = { startTime: "", endTime: "", workDescription: "",},
                                                     onSubmit,
                                                     error,
                                                     submitButtonText = locale.ADD,
                                                 }) => {
    const { task } = useTask();
    const { user} = useAuth();

    return (
        <Formik<AttendanceFormValues>
            initialValues={{
                workDescription: initialValues.workDescription ?? "",
                startTime: initialValues.startTime ? toIsoDateHour(new Date(initialValues.startTime)) : "",
                endTime: initialValues.endTime ? toIsoDateHour(new Date(initialValues.endTime)) : "",
            }}
            validationSchema={AttendanceSchema}
            onSubmit={(values, { setSubmitting }) => {
                const newAttendance: Attendance = {
                    id: initialValues.id ?? 0,
                    startTime: values.startTime ?? "",
                    endTime: values.endTime ?? "",
                    workDescription: values.workDescription,
                    taskId: task.id ?? 0,
                    appUser: user!,
                };
                onSubmit(newAttendance);
                setSubmitting(false);
            }}
        >
            {({ errors, touched, isSubmitting, handleChange }) => (
                <DialogFormContainer>
                    <Form style={{ width: "100%" }}>
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Field
                                name="startTime"
                                as={TextField}
                                label={locale.START_TIME}
                                variant="outlined"
                                fullWidth
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: null,
                                }}
                                error={touched.startTime && Boolean(errors.startTime)}
                                helperText={touched.startTime && errors.startTime}
                                onChange={handleChange}
                            />

                            <Field
                                name="endTime"
                                as={TextField}
                                label={locale.END_TIME}
                                variant="outlined"
                                fullWidth
                                type="datetime-local"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: null,
                                }}
                                error={touched.endTime && Boolean(errors.endTime)}
                                helperText={touched.endTime && errors.endTime}
                                onChange={handleChange}
                            />

                            <Field
                                name="workDescription"
                                as={TextField}
                                label={locale.WORK_DESCRIPTION}
                                variant="outlined"
                                fullWidth
                                error={touched.workDescription && Boolean(errors.workDescription)}
                                helperText={touched.workDescription && errors.workDescription}
                                onChange={handleChange}
                            />

                            {error && (
                                <Typography color="error" variant="body2">
                                    {error}
                                </Typography>
                            )}

                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                {submitButtonText}
                            </Button>
                        </Box>
                    </Form>
                </DialogFormContainer>
            )}
        </Formik>
    );
};

export default AttendanceForm;