import React from "react";
import { Col, Row, Typography } from "antd";
import ApprovalBoard from "./ApprovalBoard";
import Buttons from "../../components/Buttons";
import { useNavigate } from "react-router";
import * as constant from "../../constants";
import Venue from "./Venue";

const Admin = () => {
    let navigate = useNavigate();

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
            <ApprovalBoard />
            <Row justify="center">
                <Typography.Title level={3}>Venue</Typography.Title>
            </Row>
            <Row justify="end" style={{ margin: "10px" }}>
                <Col xs={24} sm={12} md={8} lg={3}>
                    <Buttons text="Add Venue" onClick={addVenue} />
                </Col>
            </Row>
            <Venue />
        </div>
    );
};

export default Admin;
