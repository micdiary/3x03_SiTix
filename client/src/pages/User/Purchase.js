import React from "react";
import { Row, Col, Typography, Card } from "antd";
import Payment from "../../components/Payment";
import OrderCard from "../../components/OrderCard";

const Purchase = () => {
    const dummyData = {
        orderNumber: 1,
        eventTitle: "d4vd",
        eventVenue: "Capitol Theatre",
        eventDate: "10 November 2023",
        eventDay: "Sat",
        eventTime: "8pm",
        seatNumber: "12",
        eventCat: "1",
        eventPrice: "150",
        qty: 1,
        totalPrice: "154",
    };
    return (
        <div style={{ minHeight: "100vh" }}>
            <Row justify="center" align="middle">
                <Col xs={22} sm={20} md={20} lg={20}>
                    <Row justify="center">
                        <Typography.Title level={5} style={{ color: "red" }}>
                            Timer
                        </Typography.Title>
                    </Row>
                    <Typography.Title level={2}>Payment</Typography.Title>
                    <div style={{ margin: "10px 0" }}>
                        <Card title="Contact Details" bordered={false}>
                            <Row>
                                <Col xs={10} sm={10} md={8} lg={4}>
                                    <p>Name:</p>
                                    <p>Email Address:</p>
                                    <p>Mobile No:</p>
                                </Col>
                                <Col xs={10} sm={10} md={10} lg={14}>
                                    <p>hello hello</p>
                                    <p>my name's dibo</p>
                                    <p>999</p>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                    <div style={{ margin: "10px 0" }}>
                        <OrderCard {...dummyData} />
                    </div>
                    <Payment />
                </Col>
            </Row>
        </div>
    );
};

export default Purchase;
