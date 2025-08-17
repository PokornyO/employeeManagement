import React, {useEffect, useState} from "react";
import {Button, TextField, Box, Typography, MenuItem, CircularProgress} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { DialogFormContainer } from "../../styles/mui/container/container.ts";
import {getDayWithOffset, toIsoDate} from "../../utils/date.ts";
import locale from "../../locale/cs.json";
import {Task} from "../../types/task.ts";
import {useProject} from "../providers/ProjectProvider.tsx";
import {Status} from "../../types/project.ts";
import {getEstimatedFinishDateForNewTask} from "../../services/taskService.ts";

const TaskSchema = Yup.object().shape({
    title: Yup.string().required(locale.TITLE_REQUIRED).min(5, locale.TITLE_MIN_LENGTH).max(100, locale.TITLE_MAX_LENGTH),
    description: Yup.string().required(locale.DESCRIPTION_REQUIRED).min(10, locale.DESCRIPTION_MIN_LENGTH).max(500, locale.DESCRIPTION_MAX_LENGTH),
    dueDate: Yup.date().required(locale.DUE_DATE_REQUIRED).min(new Date(), locale.DUE_DATE_FUTURE),
    status: Yup.object({
        name: Yup.string().required(locale.STATUS_REQUIRED),
        label: Yup.string().required(),
    }).required(locale.STATUS_REQUIRED),
    finishDate: Yup.date().required(locale.FINISH_REQUIRED).max(new Date(), locale.FINISH_PRESENT_OR_PAST),
    difficulty: Yup.object({
        name: Yup.string().required(locale.DIFFICULTY_REQUIRED),
        label: Yup.string().required(),
    }).required(locale.DIFFICULTY_REQUIRED),
});

interface TaskFormProps {
    initialValues?: Partial<Task>;
    onSubmit: (task: Task) => void;
    statuses: Status[];
    difficulties: Status[];
    error?: string | null;
    submitButtonText?: string;
}

interface TaskFormValues {
    title: string;
    description: string;
    dueDate: string;
    status: Status;
    finishDate: string;
    difficulty: Status;
}

const TaskForm: React.FC<TaskFormProps> = ({initialValues = { title: "", description: "", dueDate: "", status: undefined, finishDate: "", difficulty: undefined, },
                                               onSubmit, error, statuses, difficulties, submitButtonText = locale.ADD,}) => {
    const { project } = useProject();

    const initialStatus = initialValues.status || statuses[0];
    const initialDifficulty = initialValues.difficulty || difficulties[0];
    const [estimatedDueDate, setEstimatedDueDate] = useState<string>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Status>(initialDifficulty);

    useEffect(() => {
        setLoading(true);
        getEstimatedFinishDateForNewTask(selectedDifficulty.name)
            .then((response) => {
                if (response) {
                    setEstimatedDueDate(response);
                }
            })
            .catch((error) => {
                console.error("Failed to fetch estimated due date:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (statuses.length === 0) {
        error = locale.ERROR_LOADING_STATUSES;
    }

    if (difficulties.length === 0) {
        error = locale.ERROR_LOADING_DIFFICULTIES;
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Formik<TaskFormValues>
            initialValues={{
                title: initialValues.title ?? "",
                description: initialValues.description ?? "",
                dueDate: initialValues.dueDate ? toIsoDate(new Date(initialValues.dueDate)) : toIsoDate(new Date(estimatedDueDate)),
                finishDate: initialValues.finishDate ? toIsoDate(new Date(initialValues.finishDate)) : "",
                status: initialStatus,
                difficulty: selectedDifficulty,
            }}
            validationSchema={TaskSchema}
            onSubmit={(values, { setSubmitting }) => {
                const newTask: Task = {
                    id: initialValues.id ?? 0,
                    title: values.title,
                    description: values.description,
                    dueDate: values.dueDate,
                    status: values.status,
                    finishDate: values.finishDate,
                    difficulty: values.difficulty,
                    projectId: project!.id ?? 0
                };
                onSubmit(newTask);
                setSubmitting(false);
            }}
        >
            {({ errors, touched, isSubmitting, handleChange, values, setFieldValue }) => (
                <DialogFormContainer>
                    <Form style={{ width: "100%" }}>
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Field
                                name="title"
                                as={TextField}
                                label={locale.TITLE}
                                variant="outlined"
                                fullWidth
                                error={touched.title && Boolean(errors.title)}
                                helperText={touched.title && errors.title}
                                onChange={handleChange}
                            />

                            <Field
                                name="description"
                                as={TextField}
                                label={locale.DESCRIPTION}
                                variant="outlined"
                                fullWidth
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                                onChange={handleChange}
                            />

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
                                onChange={handleChange}
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
                                name="finishDate"
                                as={TextField}
                                label={locale.FINISH_DATE}
                                variant="outlined"
                                fullWidth
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: null,
                                }}
                                error={touched.finishDate && Boolean(errors.finishDate)}
                                helperText={touched.finishDate && errors.finishDate}
                                onChange={handleChange}
                            />

                            <TextField
                                select
                                name="difficulty"
                                label={locale.DIFFICULTY}
                                variant="outlined"
                                fullWidth
                                value={values.difficulty?.name || ""}
                                onChange={(event) => {
                                    const selectedDifficulty = difficulties.find(
                                        (difficulty) => difficulty.name === event.target.value
                                    );
                                    if (selectedDifficulty) {
                                        setSelectedDifficulty(selectedDifficulty);
                                        void setFieldValue("difficulty", selectedDifficulty);
                                    }
                                }}
                                error={touched.difficulty && Boolean(errors.difficulty)}
                                helperText={touched.difficulty && errors.difficulty?.name}
                            >
                                {difficulties.map((difficulty) => (
                                    <MenuItem key={difficulty.name} value={difficulty.name}>
                                        {difficulty.label}
                                    </MenuItem>
                                ))}
                            </TextField>

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

export default TaskForm;
