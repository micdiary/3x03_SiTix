import React, { useState, useRef, useEffect } from "react";
import "./RightMenu.css";
import { Input, Button, Dropdown, Menu } from "antd";
import * as constants from "../constants";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { buttonBlack, buttonWhite } from "../components/Buttons";

const RightMenu = ({ token }) => {
    let navigate = useNavigate();
    const isLaptop = useMediaQuery({ query: "(min-width: 1024px)" });

    const [isSearchExpanded, setSearchExpanded] = useState(false);
    const inputRef = useRef(null);

    const toggleSearch = () => {
        setSearchExpanded(!isSearchExpanded);
    };

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setSearchExpanded(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const loginButton = () => {
        navigate(constants.LOGIN_URL);
    };

    const profileMenu = (
        <Menu>
            <Menu.Item key="profile">
                <a href={constants.HOME_URL}>Profile</a>
            </Menu.Item>
            <Menu.Item key="profile">
                <a href={constants.HISTORY_URL}>History</a>
            </Menu.Item>
            <Menu.Item key="logout">
                <a href={constants.LOGIN_URL}>Logout</a>
            </Menu.Item>
        </Menu>
    );

    if (isLaptop) {
        return (
            <div className="right-icons">
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Search..."
                    className="search-input"
                />
                {token === null ? (
                    <Button
                        className="login-button"
                        onMouseOut={buttonBlack}
                        onMouseOver={buttonWhite}
                        onClick={loginButton}
                    >
                        <UserOutlined /> Login
                    </Button>
                ) : (
                    <Dropdown overlay={profileMenu} trigger={["click"]}>
                        <Button
                            className="profile-button"
                            onMouseOut={buttonWhite}
                            onMouseOver={buttonBlack}
                        >
                            <UserOutlined style={{ fontSize: "15px" }} />
                        </Button>
                    </Dropdown>
                )}
            </div>
        );
    } else {
        return (
            <div className="right-icons">
                {isSearchExpanded ? (
                    <div ref={inputRef}>
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Search..."
                            className="search-input-two"
                        />
                    </div>
                ) : (
                    <SearchOutlined
                        className="search-icon"
                        onClick={toggleSearch}
                    />
                )}{" "}
                {/* <UserOutlined className="login-icon" onClick={loginButton} /> */}
                {token === null ? (
                    <UserOutlined
                        className="login-icon"
                        onClick={loginButton}
                    />
                ) : (
                    <Dropdown overlay={profileMenu} trigger={["click"]}>
                        <UserOutlined className="login-icon" />
                    </Dropdown>
                )}
            </div>
        );
    }
};

export default RightMenu;
