import React from "react";
import EventCardList from "../components/EventCards";
import { Row, Col, Carousel, Divider, Typography } from "antd";
import { bodyContentStyle, carouselStyle } from "./PagesStyles";

const imagePath = [
    require("../assets/(G)i-dle.jpg"),
    require("../assets/d4vd.jpg"),
    require("../assets/HallyuPopFest.png"),
];

const dummyEventData = [
    {
        eventName: "(G)i-dle",
        eventDateTime: "Date & Time 1",
        imageUrl: imagePath[0],
    },
    {
        eventName: "d4vd",
        eventDateTime: "Date & Time 2",
        imageUrl: imagePath[1],
    },
    {
        eventName: "HallyuPopFest",
        eventDateTime: "Date & Time 3",
        imageUrl: imagePath[2],
    },
    {
        eventName: "(G)i-dle",
        eventDateTime: "Date & Time 1",
        imageUrl: imagePath[0],
    },
    {
        eventName: "d4vd",
        eventDateTime: "Date & Time 2",
        imageUrl: imagePath[1],
    },
    {
        eventName: "HallyuPopFest",
        eventDateTime: "Date & Time 3",
        imageUrl: imagePath[2],
    },
];

const Home = () => {
    return (
        <div style={{ minHeight: "100vh" }}>
            <div style={carouselStyle}>
                <Row justify="center" align="middle">
                    <Col xs={23} sm={23} md={22} lg={22}>
                        <Carousel autoplay pauseOnHover={true}>
                            {imagePath.map((imagePath, index) => (
                                <div key={index}>
                                    <img
                                        src={imagePath}
                                        alt={`Event ${index + 1}`}
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
                    <EventCardList eventData={dummyEventData} />
                </Row>
            </div>
        </div>
    );
};

export default Home;
