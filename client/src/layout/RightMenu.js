import "./Layout.css";
import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Dropdown } from "antd";
import * as constants from "../constants";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { buttonBlack, buttonWhite } from "../components/Buttons";
import { logout } from "../api/account";
import { showNotification } from "../components/Notification";
import { removeToken, removeUserType } from "../utils/account";
import { userStore } from "../store/User";

const RightMenu = ({ userType, token }) => {
    const removeUser = userStore((state) => state.removeUser);

    let navigate = useNavigate();
    const isLaptop = useMediaQuery({ query: "(min-width: 1024px)" });

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
    const loginButton = () => {
        navigate(constants.LOGIN_URL);
    };

    const logoutButton = () => {
        logout()
            .then((res) => {
                console.log("logout", res);
                showNotification(res.message);
                removeToken();
                removeUser();
                removeUserType();
                navigate(constants.HOME_URL);
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    };

    // after login
    const profileItems = [];

    if (userType === "customer") {
        profileItems.push({
            key: "1",
            label: <a href={constants.PROFILE_URL}>Profile</a>,
        });
        profileItems.push({
            key: "2",
            label: <a href={constants.HISTORY_URL}>History</a>,
        });
        profileItems.push({
            key: "3",
            label: <div onClick={logoutButton}>Logout</div>,
        });
    } else {
        profileItems.push({
            key: "1",
            label: <a href={constants.PROFILE_URL}>Profile</a>,
        });
        profileItems.push({
            key: "2",
            label: <div onClick={logoutButton}>Logout</div>,
        });
    }

    if (isLaptop) {
        return (
            <div className="right-icons">
                {userType === "customer" && (
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search..."
                        className="search-input"
                    />
                )}
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
                    <Dropdown menu={{ items: profileItems }}>
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
                {token === null ? (
                    <UserOutlined
                        className="login-icon"
                        onClick={loginButton}
                    />
                ) : (
                    <Dropdown
                        menu={{ items: profileItems }}
                        trigger={["click"]}
                    >
                        <UserOutlined className="login-icon" />
                    </Dropdown>
                )}
            </div>
        );
    }
};

export default RightMenu;
