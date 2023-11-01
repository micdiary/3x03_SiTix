import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Divider, Table } from "antd";
import * as constants from "../../constants";
import Buttons from "../../components/Buttons";
import { showNotification } from "../../components/Notification";
import { liStyle } from "../PagesStyles";
import { eventStore } from "../../store/Order";
import { getEventDetails } from "../../api/event";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date";

const Event = () => {
    let navigate = useNavigate();
    let location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const event_id = queryParams.get("event");

    const [eventData, setEventData] = useState([]);
    const [venueData, setVenueData] = useState([]);
    const [seatType, setSeatType] = useState([]);
    const [seatData, setSeatData] = useState([]);

    useEffect(() => {
        const req = { event_id: event_id };
        getEventDetails(req)
            .then((res) => {
                setEventData(res.event);
                setVenueData(res.event.venue);
                setSeatData(res.event.seat_type);
                setSeatType(res.event.venue_seat_type);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    }, [event_id]);

    const buyButton = () => {
        navigate(`${constants.TICKET_URL}?event=${event_id}`);
        eventStore.setState({ eventData });
    };

    const dataSource =
        seatData &&
        seatData.map((seat) => {
            const matchingSeatType = seatType.find(
                (type) => type.seat_type_id === seat.seat_type_id
            );

            return {
                type_name: matchingSeatType
                    ? matchingSeatType.type_name
                    : "Unknown Type",
                price: seat.price,
                key: seat.seat_type_id,
            };
        });

    const priceColumns = [
        {
            dataIndex: "type_name",
            key: "type_name",
        },
        {
            dataIndex: "price",
            key: "price",
            render: (text) => `$${text}`,
        },
    ];

    const eventDate = new Date(eventData.date);
    const { date, day, time } = formatDate(eventDate);

    return (
        <div style={{ minHeight: "100vh" }}>
            <div>
                <Row justify="center" align="middle">
                    <Col>
                        <div style={{ margin: "0 10px" }}>
                            <Typography.Title level={2}>
                                {eventData.event_name}
                            </Typography.Title>
                            <img
                                src={`data:image/jpg;base64,${eventData.banner_img}`}
                                alt={eventData.event_name}
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
                                {date} ({day}) / {venueData.venue_name}
                            </Typography.Title>
                        </div>
                    </Col>
                    <Col xs={24} sm={8} md={6} lg={6} xl={4}>
                        <Buttons
                            text="Buy Now"
                            marginTop="20px"
                            onClick={buyButton}
                        />
                    </Col>
                    <Divider />
                </Row>
            </div>
            <div style={{ margin: "0 10px" }}>
                <Row>
                    <Col xl={2}></Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={20}>
                        <Row style={{ backgroundColor: "#ECECEC" }}>
                            <Col style={{ margin: "0 0 15px 15px" }}>
                                <Typography.Title level={3}>
                                    Details
                                </Typography.Title>
                                <Typography.Text>
                                    {eventData.description} The event will take
                                    place on {date} at {venueData.venue_name},{" "}
                                    {time}.
                                </Typography.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ margin: "0 0 15px 15px" }}>
                                <Typography.Title level={3}>
                                    Ticket Pricing
                                </Typography.Title>
                                <Typography.Text strong style={liStyle}>
                                    Ticket Rules:
                                </Typography.Text>
                                <ul>
                                    <li style={liStyle}>
                                        Limited to 4 tickets per transaction.
                                    </li>
                                    <li style={liStyle}>
                                        Each account can have unlimited
                                        transactions.
                                    </li>
                                    <li style={liStyle}>
                                        Ticket Pricing excludes Booking Fee.
                                    </li>
                                    <li style={liStyle}>
                                        Booking fee is $6 per ticket.
                                    </li>
                                </ul>
                                <Typography.Text>
                                    <Table
                                        dataSource={dataSource}
                                        columns={priceColumns}
                                        pagination={false}
                                        showHeader={false}
                                        size="small"
                                    />
                                </Typography.Text>
                            </Col>
                        </Row>
                        <Row style={{ backgroundColor: "#ECECEC" }}>
                            <Col style={{ margin: "0 0 15px 15px" }}>
                                <Typography.Title level={3}>
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
                        <Row>
                            <Col style={{ margin: "0 0 15px 15px" }}>
                                <Typography.Title level={3}>
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
