import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchEvent } from "../api/event";
import { showNotification } from "../components/Notification";
import { Divider, Row, Typography } from "antd";
import EventCardList from "../components/EventCards";
import { getToken } from "../utils/account";
import { bodyContentStyle } from "./PagesStyles";

const SearchContent = () => {
    const localToken = getToken();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get("query");

    const [searchResults, setSearchResults] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState();

    useEffect(() => {
        setIsLoggedIn(localToken);
    }, [localToken]);


    useEffect(() => {
        searchEvent({ event_name: searchQuery })
            .then((res) => {
                setSearchResults(res.events);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    }, [searchQuery]);

    return (
        <div>
            <div style={bodyContentStyle}>
                <Typography.Title level={5}>
                    Search Results for: {searchQuery}
                </Typography.Title>
                <Divider />
                <Row>
                    <EventCardList
                        events={searchResults}
                        isLoggedIn={isLoggedIn}
                    />
                </Row>
            </div>
        </div>
    );
};

export default SearchContent;
