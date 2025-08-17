import React, { useState, useEffect } from "react";
import { Button, TextField, Box, Typography, Autocomplete } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { DialogFormContainer } from "../../styles/mui/container/container.ts";
import { searchUsers } from "../../services/memberService.ts";
import { Member } from "../../types/member.ts";
import locale from "../../locale/cs.json";
import {useProject} from "../providers/ProjectProvider.tsx";

const MemberSchema = Yup.object().shape({
    user: Yup.object()
        .shape({
            id: Yup.number().required(locale.CHOOSE_USER),
            username: Yup.string(),
        })
        .nullable()
        .required(locale.CHOOSE_USER),
});

interface MemberFormProps {
    onSubmit: (user: Member) => void;
    error?: string | null;
    submitButtonText?: string;
}

const MemberForm: React.FC<MemberFormProps> = ({
   onSubmit,
   error,
   submitButtonText = locale.ADD,
}) => {
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [userOptions, setUserOptions] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const { project } = useProject();

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery) {
                setLoadingUsers(true);
                try {
                    const response = await searchUsers(searchQuery);
                    if (response.success) {
                        response.members = response.members!.filter(
                            (member: Member) => member.id !== project!.leader.id
                        );
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
        <Formik
            initialValues={{ user: null }}
            validationSchema={MemberSchema}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values.user!);
                setSubmitting(false);
            }}
        >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
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

export default MemberForm;
