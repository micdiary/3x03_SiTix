import React, { useState } from "react";
import * as constants from "../constants";
import { Row, Col, Typography, Divider } from "antd";
import eventBackground from "../assets/d4vd.jpg";
import Buttons from "../components/Buttons";
import { useNavigate } from "react-router-dom";

const Event = () => {
    let navigate = useNavigate();
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const buyNowButton = () => {
        navigate(constants.QUEUE_URL);
    };

    // const logInButton = () => {
    //     navigate(constants.LOGIN_URL);
    // };

    return (
        <div style={{ minHeight: "100vh" }}>
            <div>
                <Row justify="center" align="middle">
                    <Col>
                        <div style={{ margin: "0 10px" }}>
                            <Typography.Title level={2}>
                                Event Name
                            </Typography.Title>
                            <img
                                src={eventBackground}
                                alt="Event Background"
                                style={{ maxWidth: "100%", height: "100%" }}
                            />
                        </div>
                    </Col>
                </Row>
                <Row style={{ margin: "0 10px" }}>
                    <Col xl={2}></Col>
                    <Col xs={24} sm={16} md={18} lg={18} xl={16}>
                        <div>
                            <Typography.Title level={4}>
                                Date (Time) / Venue
                            </Typography.Title>
                        </div>
                    </Col>
                    <Col xs={24} sm={8} md={6} lg={6} xl={4}>
                        <Buttons
                            text="Buy Now"
                            marginTop="20px"
                            onClick={buyNowButton}
                        />
                    </Col>
                    <Divider />
                </Row>
            </div>
            <div className="body" style={{ margin: "0 10px" }}>
                <Row>
                    <Col xl={2}></Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={20}>
                        <Row>
                            <Col>
                                <Typography.Title level={2}>
                                    Details
                                </Typography.Title>
                                <Typography.Text>fk 3103</Typography.Text>
                            </Col>
                        </Row>
                        <Row style={{ backgroundColor: "#ECECEC" }}>
                            <Col>
                                <Typography.Title level={2}>
                                    Ticket Pricing
                                </Typography.Title>
                                <Typography.Text>someshit</Typography.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Typography.Title level={2}>
                                    Details
                                </Typography.Title>
                                <Typography.Text>fk 3103</Typography.Text>
                            </Col>
                        </Row>
                        <Row style={{ backgroundColor: "#ECECEC" }}>
                            <Col>
                                <Typography.Title level={2}>
                                    Exchange & Refund Policy
                                </Typography.Title>
                                <Typography.Text>someshit</Typography.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Typography.Title level={2}>
                                    Admission Policy
                                </Typography.Title>
                                <Typography.Text>fk 3103</Typography.Text>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Event;
