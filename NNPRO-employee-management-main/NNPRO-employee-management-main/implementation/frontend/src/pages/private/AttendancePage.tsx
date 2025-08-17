import React from "react";
import {Helmet, HelmetProvider} from "react-helmet-async";
import ContentHolder from "../../components/containers/ContentHolder.tsx";
import locale from "../../locale/cs.json";
import AttendanceManagement from "../../components/attendance/AttendanceManagement.tsx";
import {useTask} from "../../components/providers/TaskProvider.tsx";

const AttendancePage: React.FC = () => {
    const { task } = useTask();

    return (
        <HelmetProvider>
            <Helmet>
                <title>{locale.ATTENDANCE} - {task?.title}</title>
            </Helmet>
            <ContentHolder title={locale.ATTENDANCE_LIST}>
                <AttendanceManagement />
            </ContentHolder>
        </HelmetProvider>
    );

};

export default AttendancePage;
