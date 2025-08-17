export const toIsoDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const toIsoDateHour = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};


export const toIsoDateTime = (date: string | Date): string => {
    if (typeof date === 'string') {
        date = new Date(date);
    }

    return date.toISOString().split('.')[0];
}

export const getDayWithOffset = (offset: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date;
}
