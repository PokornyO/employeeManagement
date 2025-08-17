import * as Yup from "yup";
import locale from "../../locale/cs.json";
import React from "react";
import {useTask} from "../providers/TaskProvider.tsx";
import {useAuth} from "../providers/AuthProvider.tsx";
import {Field, Form, Formik} from "formik";
import {DialogFormContainer} from "../../styles/mui/container/container.ts";
import {Box, Button, TextField, Typography} from "@mui/material";
import {Comment} from "../../types/comment.ts";


const CommentSchema = Yup.object().shape({
    text: Yup.string().required(locale.TEXT_REQUIRED),
});

interface CommentFormProps {
    initialValues?: Partial<Comment>;
    onSubmit: (comment: Comment) => void;
    error?: string | null;
    submitButtonText?: string;
}

interface CommentFormValues {
    text: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
                                                           initialValues = { text: "",},
                                                           onSubmit,
                                                           error,
                                                           submitButtonText = locale.ADD,
                                                       }) => {
    const { task } = useTask();
    const { user} = useAuth();

    return (
        <Formik<CommentFormValues>
            initialValues={{
                text: initialValues.text ?? "",
            }}
            validationSchema={CommentSchema}
            onSubmit={(values, { setSubmitting }) => {
                const newComment: Comment = {
                    id: initialValues.id ?? 0,
                    text: values.text ?? "",
                    createdDate: "",
                    task: task!,
                    appUser: user!,
                };
                onSubmit(newComment);
                setSubmitting(false);
            }}
        >
            {({ errors, touched, isSubmitting, handleChange }) => (
                <DialogFormContainer>
                    <Form style={{ width: "100%" }}>
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Field
                                name="text"
                                as={TextField}
                                label={locale.TEXT}
                                variant="outlined"
                                fullWidth
                                error={touched.text && Boolean(errors.text)}
                                helperText={touched.text && errors.text}
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

export default CommentForm;