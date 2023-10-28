import React, { useState } from "react";
import * as constants from "../constants";
import { Row, Col, Card } from "antd";
import { Link } from "react-router-dom";
import { eventStore } from "../store/User";
const { Meta } = Card;

const EventCard = ({ event_id, event_name, date, image }) => {
    return (
        <Link to={`${constants.EVENT_URL}/${event_id}`}>
            <Card
                style={{ margin: "10px" }}
                cover={<img alt={event_name} src={image} />}
            >
                <Meta
                    title={<span style={{ color: "black" }}>{event_name}</span>}
                    description={date}
                />
            </Card>
        </Link>
    );
};

const EventCardList = ({ events }) => {
    return (
        <>
            <Row justify="left" gutter={16}>
                {events.map((eventData, index) => {
                    const eventDate = new Date(eventData.date);
                    const event_date = eventDate.toLocaleDateString("en-US");
                    const time = eventDate.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                    });

                    return (
                        <Col key={index} xs={24} sm={22} md={12} lg={10} xl={8}>
                            <EventCard
                                event_id={eventData.event_id}
                                event_name={eventData.event_name}
                                date={`${event_date} ${time}`}
                                image={`data:image/jpg;base64,${eventData.banner_img}`}
                            />
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};

export default EventCardList;
