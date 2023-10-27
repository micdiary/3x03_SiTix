import React, { useEffect, useState } from "react";
import { Col, Row, Typography } from "antd";
import ApprovalBoard from "./ApprovalBoard";
import Buttons from "../../components/Buttons";
import { useNavigate } from "react-router";
import * as constant from "../../constants";
import Venue from "./Venue";
import { showNotification } from "../../components/Notification";
import { getVenue } from "../../api/venue";
import { getRequest } from "../../api/request";

const Admin = () => {
    let navigate = useNavigate();
    const [venueData, setVenueData] = useState([]);
    const [eventData, setEventData] = useState([]);
    const [updatedReq, setUpdatedReq] = useState([]);
    const [updated, setUpdated] = useState([]);

    useEffect(() => {
        getVenue()
            .then((res) => {
                console.log(res.venues);
                const venues = res.venues.map((venue) => ({
                    ...venue,
                    key: venue.venue_id,
                }));
                setVenueData(venues);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    }, [updated]);

    useEffect(() => {
        getRequest()
            .then((res) => {
                const requests = res.requests.map((request) => ({
                    ...request,
                    key: request.request_id,
                }));
                console.log(res.requests);
                setEventData(requests);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    }, [updatedReq]);

    const addEvent = () => {
        navigate(constant.ADD_EVENT_URL);
    };

    const addVenue = () => {
        navigate(constant.ADD_VENUE_URL);
    };

    return (
        <div style={{ margin: "20px" }}>
            <Row justify="center">
                <Typography.Title level={3}>
                    Admin Approval Board
                </Typography.Title>
            </Row>
            <Row justify="end" style={{ margin: "10px" }}>
                <Col xs={24} sm={12} md={8} lg={3}>
                    <Buttons text="Create Event" onClick={addEvent} />
                </Col>
            </Row>
            <ApprovalBoard
                eventData={eventData}
                updatedReq={updatedReq}
                setUpdatedReq={setUpdatedReq}
            />
            <Row justify="center">
                <Typography.Title level={3}>Venue</Typography.Title>
            </Row>
            <Row justify="end" style={{ margin: "10px" }}>
                <Col xs={24} sm={12} md={8} lg={3}>
                    <Buttons text="Add Venue" onClick={addVenue} />
                </Col>
            </Row>
            <Venue
                venueData={venueData}
                updated={updated}
                setUpdated={setUpdated}
            />
        </div>
    );
};

export default Admin;
