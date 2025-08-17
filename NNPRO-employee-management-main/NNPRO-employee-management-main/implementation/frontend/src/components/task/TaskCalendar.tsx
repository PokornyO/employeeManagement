import React, {useState} from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import csLocale from '@fullcalendar/core/locales/cs';
import {CalendarWrapper} from "../../styles/calendar/calendar.ts";
import {DatesSetArg} from "@fullcalendar/core";
import {getAllProjectTasks} from "../../services/taskService.ts";
import {useProject} from "../providers/ProjectProvider.tsx";
import {Task} from "../../types/task.ts";
import {getColorByStatus} from "../../utils/color.ts";

const TaskCalendar: React.FC = () => {
    const { project } = useProject();
    const [tasks, setTasks] = useState<Task[]>([]);

    const handleDatesSet = async (arg: DatesSetArg) => {
        const calendarApi = arg.view.calendar;
        const currentDate = calendarApi.getDate();

        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const dateFrom = new Date(year, month - 2, 1, 0, 0, 0);
        const dateTo = new Date(year, month + 1, 0, 23, 59, 59);

        const response = await getAllProjectTasks(project!.id, 0, 100, dateFrom, dateTo);
        if (response.success) {
            setTasks(response.tasks!);
        }
    };

    const events = tasks.map(task => {
        return {
            id: task.id.toString(),
            title: task.title,
            start: task.dueDate,
            allDay: true,
            color: getColorByStatus(task.status, new Date(task.dueDate)),
        };
    });

    return (
        <CalendarWrapper>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale={csLocale}
                datesSet={handleDatesSet}
                events={events}
                displayEventTime={false}
            />
        </CalendarWrapper>
    );
}

export default TaskCalendar;
