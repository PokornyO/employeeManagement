import {theme} from "../constants/theme.ts";

export const getColorByStatus = (status: string, dueDate: string | Date): string => {
    const todayNumber = new Date().setHours(0, 0, 0, 0);

    if (typeof dueDate === 'string') {
        dueDate = new Date(dueDate);
    }

    const dueDateNumber = dueDate.setHours(0, 0, 0, 0);

    if (status === 'COMPLETED') {
        return theme.success;
    }

    if (status == "CANCELLED" || dueDateNumber < todayNumber) {
        return theme.error;
    }

    return theme.warning;
}

export const getColorByDifficulty = (difficulty: string): string => {
    if (difficulty === 'EASY') {
        return theme.success;
    }

    if (difficulty == "HARD") {
        return theme.error;
    }

    return theme.warning;
}