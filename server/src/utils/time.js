export const getCurrentTime = () => {
    const current_time = new Date().toISOString().slice(0, 19).replace("T", " ");
    return current_time;
}