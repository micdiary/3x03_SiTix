import { notification } from "antd";

export const showNotification = (message, type = "success") => {
    notification[type]({
        message: message,
        description: "",
        onClick: () => {
            console.log("Notification Clicked!");
        },
        placement: "top",
    });
};
