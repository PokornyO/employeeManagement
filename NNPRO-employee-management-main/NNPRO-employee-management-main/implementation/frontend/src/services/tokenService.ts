export const getToken = (type: string) => {
    const userData = localStorage.getItem('user_data');
    if (!userData) return null;

    const parsedUserData = JSON.parse(userData);
    return parsedUserData.tokens[type];
};