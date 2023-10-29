import React, { useState } from "react";
import dayjs from "dayjs";
import * as constants from "../constants";
import { Row, Col, Card } from "antd";
import { Link } from "react-router-dom";
import { dateTimeToUnix, formatDate } from "../utils/date";
const { Meta } = Card;

const EventCard = ({ event_id, event_name, date, image, isLoggedIn }) => {
    return (
        <Link
            to={{
                pathname: isLoggedIn
                    ? constants.EVENT_URL
                    : constants.LOGIN_URL,
                search: `?event=${event_id}`,
            }}
        >
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

const EventCardList = ({ events, isLoggedIn }) => {
    return (
        <>
            <Row justify="left" gutter={16}>
                {events.map((eventData, index) => {
                    const eventDate = new Date(eventData.date);
                    const { date, day, time } = formatDate(eventDate);

                    return (
                        <Col key={index} xs={24} sm={22} md={12} lg={10} xl={8}>
                            <EventCard
                                event_id={eventData.event_id}
                                event_name={eventData.event_name}
                                date={`${date} ${time}`}
                                image={`data:image/jpg;base64,${eventData.banner_img}`}
                                isLoggedIn={isLoggedIn}
                            />
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};

export default EventCardList;
