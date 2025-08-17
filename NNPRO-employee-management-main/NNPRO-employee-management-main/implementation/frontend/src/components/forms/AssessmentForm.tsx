import * as Yup from "yup";
import locale from "../../locale/cs.json";
import React, {useEffect, useState} from "react";
import {useTask} from "../providers/TaskProvider.tsx";
import {useAuth} from "../providers/AuthProvider.tsx";
import {Field, Form, Formik} from "formik";
import {DialogFormContainer} from "../../styles/mui/container/container.ts";
import {Autocomplete, Box, Button, TextField, Typography} from "@mui/material";
import {Assessment} from "../../types/assessment.ts";
import {toIsoDate} from "../../utils/date.ts";
import {Member} from "../../types/member.ts";
import {searchUsers} from "../../services/memberService.ts";

const AssessmentSchema = Yup.object().shape({
    reviewDate: Yup.date().required(locale.REVIEW_DATE_REQUIRED).max(new Date(), locale.REVIEW_DATE_PRESENT_OR_PAST),
    overallRating: Yup.string().required(locale.OVERALL_RATING_REQUIRED),
    feedback: Yup.string().required(locale.FEEDBACK_REQUIRED),
});

interface AssessmentFormProps {
    initialValues?: Partial<Assessment>;
    onSubmit: (assessment: Assessment) => void;
    error?: string | null;
    submitButtonText?: string;
}

interface AssessmentFormValues {
    reviewDate: string;
    overallRating: number;
    feedback: string;
    user: Member;

}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
                                                     initialValues = { reviewDate: "", overallRating: 0, feedback: "",},
                                                     onSubmit,
                                                     error,
                                                     submitButtonText = locale.ADD,
                                                 }) => {
    const { task } = useTask();
    const { user} = useAuth();
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [userOptions, setUserOptions] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery) {
                setLoadingUsers(true);
                try {
                    const response = await searchUsers(searchQuery);
                    if (response.success) {
                        setUserOptions(response.members || []);
                    }
                } catch (err) {
                    console.error("Error searching users:", err);
                } finally {
                    setLoadingUsers(false);
                }
            } else {
                setUserOptions([]);
            }
        }, 200);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <Formik<AssessmentFormValues>
            initialValues={{

                reviewDate: initialValues.reviewDate ? toIsoDate(new Date(initialValues.reviewDate)) : "",
                overallRating: initialValues.overallRating ?? 0,
                feedback: initialValues.feedback ?? "",
                user: user!,
            }}
            validationSchema={AssessmentSchema}
            onSubmit={(values, { setSubmitting }) => {
                const newAssessment: Assessment = {
                    id: initialValues.id ?? 0,
                    reviewDate: values.reviewDate,
                    overallRating: values.overallRating,
                    feedback: values.feedback,
                    task: task!,
                    appUser: values.user,
                };
                onSubmit(newAssessment);
                setSubmitting(false);
            }}
        >
            {({ errors, touched, isSubmitting, handleChange, setFieldValue }) => (
                <DialogFormContainer>
                    <Form style={{ width: "100%" }}>
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Autocomplete
                                options={userOptions}
                                getOptionLabel={(option) =>
                                    `${option.surname}, ${option.firstName} (${option.email})`
                                }
                                loading={loadingUsers}
                                inputValue={searchQuery}
                                onInputChange={(_, value) => setSearchQuery(value)}
                                onChange={(_, value) => setFieldValue("user", value)}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                noOptionsText={locale.NO_OPTIONS}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={locale.SEARCH_USER}
                                        variant="outlined"
                                        error={touched.user && Boolean(errors.user)}
                                        helperText={touched.user && errors.user}
                                    />
                                )}
                            />

                            <Field
                                name="overallRating"
                                as={TextField}
                                label={locale.OVERALL_RATING}
                                variant="outlined"
                                fullWidth
                                error={touched.overallRating && Boolean(errors.overallRating)}
                                helperText={touched.overallRating && errors.overallRating}
                                onChange={handleChange}
                            />

                            <Field
                                name="feedback"
                                as={TextField}
                                label={locale.FEEDBACK}
                                variant="outlined"
                                fullWidth
                                error={touched.feedback && Boolean(errors.feedback)}
                                helperText={touched.feedback && errors.feedback}
                                onChange={handleChange}
                            />

                            <Field
                                name="reviewDate"
                                as={TextField}
                                label={locale.REVIEW_DATE}
                                variant="outlined"
                                fullWidth
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    min: null,
                                }}
                                error={touched.reviewDate && Boolean(errors.reviewDate)}
                                helperText={touched.reviewDate && errors.reviewDate}
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

export default AssessmentForm;