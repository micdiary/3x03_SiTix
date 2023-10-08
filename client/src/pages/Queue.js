import React from "react";
// import clockImage from "../assets/clock.png";
import eventBackground from "../assets/d4vd.jpg";
import { Card, Col, Divider, Progress, Row, Typography } from "antd";
import { cardStylethree, marginTopOneStyle } from "./PagesStyles";

const Queue = () => {
    return (
        <Row justify="center" align="middle">
            <Col xs={22} sm={20} md={16} lg={14}>
                <Card style={cardStylethree}>
                    <div align="middle">
                        {/* <img src={clockImage} alt="clock" /> */}
                        <Typography.Title level={2}>
                            You Are Now In The Queue
                        </Typography.Title>
                        <Typography.Text strong>
                            When it's your turn, we will walk you through to
                            choose your tickets.
                        </Typography.Text>
                    </div>
                    <Divider />
                    <div>
                        <img
                            src={eventBackground}
                            alt="Event Background"
                            style={{ maxWidth: "100%", height: "100%" }}
                        />
                    </div>
                    <Divider />
                    <Row>
                        <Typography.Text strong>What To Expect</Typography.Text>
                    </Row>
                    <Row style={marginTopOneStyle}>
                        <Typography.Text>
                            Each person are only allowed to make one purchase at
                            a time.
                        </Typography.Text>
                    </Row>
                </Card>
                <Row>
                    <Col>
                        <Typography.Title level={5}>
                            Your Queue Number Is:
                        </Typography.Title>
                    </Col>
                </Row>
                <div style={{ marginTop: "20px" }}>
                    <Progress
                        percent={50}
                        showInfo={false}
                        strokeColor="#000"
                        size={["100%", 20]}
                    />
                </div>
            </Col>
        </Row>
    );
};

export default Queue;
