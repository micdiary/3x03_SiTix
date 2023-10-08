import React from "react";
import * as constants from "../constants";
import { Row, Col, Card } from "antd";
import { Link } from "react-router-dom";
const { Meta } = Card;

const EventCard = ({ eventName, eventDateTime, imageUrl }) => {
    return (
        <Link to={constants.EVENT_URL}>
            <Card
                style={{ margin: "10px" }}
                cover={<img alt="example" src={imageUrl} />}
            >
                <Meta
                    title={<span style={{ color: "black" }}>{eventName}</span>}
                    description={eventDateTime}
                />
            </Card>
        </Link>
    );
};

const EventCardList = ({ eventData }) => {
    return (
        <>
            <Row justify="center" gutter={16}>
                {eventData.map((eventData, index) => (
                    <Col key={index} xs={24} sm={20} md={12} lg={10} xl={8}>
                        <EventCard
                            eventName={eventData.eventName}
                            eventDateTime={eventData.eventDateTime}
                            imageUrl={eventData.imageUrl}
                        />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default EventCardList;
