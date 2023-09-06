import React from "react";
import { Menu } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

const menuItemStyle = { margin: "0 10px", fontSize: "14px" };
const items = [
    {
        label: "Events",
        key: "event",
        icon: <CalendarOutlined />,
    },
    {
        label: "Categories",
        key: "category",
        icon: <EnvironmentOutlined />,
    },
    {
        label: "Venues",
        key: "venue",
        icon: <EnvironmentOutlined />,
    },
];

const LeftMenu = () => {
    const isLaptop = useMediaQuery({ query: "(min-width: 1024px)" });

    return (
        <Menu mode={isLaptop ? "horizontal" : "vertical"}>
            {items.map((item) => (
                <Menu.Item key={item.key} style={menuItemStyle}>
                    {item.icon} {item.label}
                </Menu.Item>
            ))}
        </Menu>
    );
};

export default LeftMenu;
