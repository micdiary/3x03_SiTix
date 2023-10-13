import React, { useEffect, useState } from "react";
import * as constants from "../constants";
import { Row, Col, Typography, Divider } from "antd";
import eventBackground from "../assets/d4vd.jpg";
import Buttons from "../components/Buttons";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/account";
import { userStore } from "../store/User";
import { liStyle } from "./PagesStyles";

const Event = () => {
    let navigate = useNavigate();
    const localToken = getToken();
    const storeToken = userStore((state) => state.token);
    const [isLoggedIn, setIsLoggedIn] = useState(
        localToken !== null ? localToken : storeToken
    );

    useEffect(() => {
        setIsLoggedIn(localToken !== null ? localToken : storeToken);
    }, [localToken, storeToken]);

    const buyButton = () => {
        navigate(constants.QUEUE_URL);
    };

    const loginButton = () => {
        navigate(constants.HOME_URL);
    };

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
                            onClick={isLoggedIn ? buyButton : loginButton}
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
                                    Admission Policy
                                </Typography.Title>
                                <Typography.Text strong style={liStyle}>
                                    Admission Rules:
                                </Typography.Text>
                                <ul>
                                    <li style={liStyle}>
                                        Admission to show/venue by full ticket
                                        only. Printed/electronic tickets must be
                                        produced for admission.
                                    </li>
                                    <li style={liStyle}>
                                        There will be no admission for infants
                                        in arms and children below 5 years old.
                                    </li>
                                    <li style={liStyle}>
                                        Individuals and Children aged 5 years
                                        old and above will be required to
                                        purchase a ticket for admission.
                                    </li>
                                    <li style={liStyle}>
                                        Photography and videography of any form
                                        and social media live streaming is not
                                        allowed.
                                    </li>
                                    <li style={liStyle}>
                                        No outside food and beverage are allowed
                                        into the venue.
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                        <Row style={{ backgroundColor: "#ECECEC" }}>
                            <Col>
                                <Typography.Title level={2}>
                                    Exchange & Refund Policy
                                </Typography.Title>
                                <ol>
                                    <li style={liStyle}>
                                        The Organiser/Venue Owner reserves the
                                        right without refund or compensation to
                                        refuse admission/evict any person(s)
                                        whose conduct is disorderly or
                                        inappropriate or who poses a threat to
                                        security, or to the enjoyment of the
                                        Event by others.
                                    </li>
                                    <li style={liStyle}>
                                        Ticket holders assume all risk of injury
                                        and all responsibility for property
                                        loss, destruction, or theft and release
                                        the promoters, performers, sponsors,
                                        ticket outlets, venues, and their
                                        employees from any liability thereafter.
                                    </li>
                                    <li style={liStyle}>
                                        The resale of ticket(s) at the same or
                                        any price in excess of the initial
                                        purchase price is prohibited.
                                    </li>
                                    <li style={liStyle}>
                                        There is no refund, exchange, upgrade,
                                        or cancellation once ticket(s) are sold.
                                    </li>
                                    <li style={liStyle}>
                                        We would like to caution members of the
                                        public against purchasing tickets from
                                        unauthorized sellers or 3rd party
                                        websites. By purchasing tickets through
                                        these non-authorized points of sale,
                                        buyers take on the risk that the
                                        validity of the tickets cannot be
                                        guaranteed, with no refunds possible.
                                    </li>
                                </ol>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Event;
