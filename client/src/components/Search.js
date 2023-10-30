import { useNavigate } from "react-router-dom";
import "../layout/Layout.css";
import React, { useState } from "react";
import { SEARCH_URL } from "../constants";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

const Search = ({ className }) => {
    let navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`${SEARCH_URL}?query=${searchQuery}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearchSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSearchSubmit}>
            <Input
                prefix={<SearchOutlined />}
                placeholder="Search by event, and press enter!"
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyPress}
                className={className}
            />
        </form>
    );
};

export default Search;
