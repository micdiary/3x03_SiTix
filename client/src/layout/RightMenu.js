import "./Layout.css";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import * as constants from "../constants";
import Search from "../components/Search";
import { showNotification } from "../components/Notification";
import { buttonBlack, buttonWhite } from "../components/Buttons";
import { logout } from "../api/account";
import { userStore } from "../store/User";
import { getUserType, removeToken, removeUserType } from "../utils/account";

const RightMenu = ({ userType, token }) => {
    let navigate = useNavigate();

    const inputRef = useRef(null);
    const isLaptop = useMediaQuery({ query: "(min-width: 1024px)" });

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchExpanded, setSearchExpanded] = useState(false);

    const removeUser = userStore((state) => state.removeUser);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
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

    if ((userType || getUserType()) === "customer") {
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

    const items = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        // Add more items here
    ];

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    if (isLaptop) {
        return (
            <div className="right-icons">
                {(userType === "customer" || userType === null) && (
                    <Search className={"search-input"} />
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
                {(getUserType() === "customer" || getUserType() === null) &&
                    (isSearchExpanded ? (
                        <div ref={inputRef}>
                            <Search className={"search-input-two"} />
                        </div>
                    ) : (
                        <SearchOutlined
                            className="search-icon"
                            onClick={toggleSearch}
                        />
                    ))}{" "}
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
