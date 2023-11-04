import React from "react";
import { Menu } from "antd";
import * as constants from "../constants";
import { Link } from "react-router-dom";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

const menuItemStyle = { margin: "0 10px", fontSize: "14px" };
const items = [
    {
        label: "Events",
        key: "event",
        icon: <CalendarOutlined />,
        disabled: true,
    },
    {
        label: "Categories",
        key: "category",
        icon: <EnvironmentOutlined />,
        disabled: true,
    },
    {
        label: "Venues",
        key: "venue",
        icon: <EnvironmentOutlined />,
        disabled: true,
    },
];

const LeftMenu = () => {
    const isLaptop = useMediaQuery({ query: "(min-width: 1024px)" });
    return (
        <Menu mode={isLaptop ? "horizontal" : "vertical"}>
            {items.map((item) => (
                <Menu.Item
                    key={item.key}
                    style={menuItemStyle}
                    disabled={item.disabled}
                >
                    {item.key === "category" ||
                    item.key === "event" ||
                    item.key === "venue" ? (
                        <Link to={constants.CATEGORY_URL}>
                            {item.icon} {item.label}
                        </Link>
                    ) : (
                        <>
                            {item.icon} {item.label}
                        </>
                    )}
                </Menu.Item>
            ))}
        </Menu>
    );
};

export default LeftMenu;
