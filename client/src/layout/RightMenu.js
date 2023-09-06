import React, { useState, useRef, useEffect } from "react";
import { Input, Button } from "antd";
import * as constants from "../constants";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const rightIconsStyle = { display: "flex", alignItems: "center" };
const searchIconStyle = { fontSize: "16px", cursor: "pointer" };
const loginIconStyle = {
    fontSize: "16px",
    cursor: "pointer",
    margin: "0 5px 0 15px",
};
const searchInputStyle = {
    width: "300px",
    height: "40px",
    borderRadius: "50px",
};
const searchInputTwoStyle = {
    width: "200px",
    height: "30px",
    borderRadius: "50px",
    marginBottom: "10px",
};
const loginButtonStyle = {
    color: "white",
    height: "40px",
    marginLeft: "10px",
    borderRadius: "50px",
    backgroundColor: "black",
};

const RightMenu = () => {
    const navigate = useNavigate();
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

    if (isLaptop) {
        return (
            <div style={rightIconsStyle}>
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Search..."
                    style={searchInputStyle}
                />
                <Button style={loginButtonStyle} onClick={loginButton}>
                    <UserOutlined /> Login
                </Button>
            </div>
        );
    } else {
        return (
            <div style={rightIconsStyle}>
                {isSearchExpanded ? (
                    <div ref={inputRef}>
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Search..."
                            style={searchInputTwoStyle}
                        />
                    </div>
                ) : (
                    <SearchOutlined
                        style={searchIconStyle}
                        onClick={toggleSearch}
                    />
                )}
                <UserOutlined style={loginIconStyle} onClick={loginButton} />
            </div>
        );
    }
};

export default RightMenu;
