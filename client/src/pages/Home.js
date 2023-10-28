import React, { useEffect, useState } from "react";
import EventCardList from "../components/EventCards";
import { Row, Col, Carousel, Divider, Typography } from "antd";
import { bodyContentStyle, carouselStyle } from "./PagesStyles";
import { getEvent } from "../api/event";

const Home = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        getEvent().then((res) => {
            const events = res.events.map((event) => ({
                ...event,
                key: event.id,
            }));
            setEvents(events);
        });
    }, []);

    return (
        <div style={{ minHeight: "100vh" }}>
            <div style={carouselStyle}>
                <Row justify="center" align="middle">
                    <Col xs={23} sm={23} md={22} lg={22}>
                        <Carousel autoplay pauseOnHover={true}>
                            {events.map((event, index) => (
                                <div key={index}>
                                    <img
                                        src={`data:image/jpg;base64,${event.banner_img}`}
                                        alt={`Event ${event.event_name}`}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </Col>
                </Row>
            </div>
            <div style={bodyContentStyle}>
                <Typography.Title level={2}>All Events</Typography.Title>
                <Divider />
                <Row>
                    <EventCardList events={events} />
                </Row>
            </div>
        </div>
    );
};

export default Home;
