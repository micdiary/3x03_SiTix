import React from "react";
import { Row, Col, Typography } from "antd";
import OrderCard from "../components/OrderCard";

const History = () => {
    const orderDummyData = [
        {
            purchasedDateTime: "date, time",
            orderNumber: 1,
            eventTitle: "HallyuFest",
            eventVenue: "Singpare National Stadium",
            eventDate: "11 November 2023",
            eventDay: "Sun",
            eventTime: "8pm",
            sectionId: "201",
            rowNumber: "1",
            seatNumber: "5",
            eventCat: "2",
            eventPrice: "128",
            qty: 1,
            totalPrice: "132",
        },
        {
            purchasedDateTime: "date, time",
            orderNumber: 2,
            eventTitle: "Concert ABC",
            eventVenue: "Venue XYZ",
            eventDate: "10 November 2023",
            eventDay: "Sat",
            eventTime: "8pm",
            sectionId: "323",
            rowNumber: "3",
            seatNumber: "12",
            eventCat: "1",
            eventPrice: "150",
            qty: 2,
            totalPrice: "308",
        },
    ];

    return (
        <div style={{ minHeight: "100vh" }}>
            <Row justify="center" align="middle">
                <Col xs={22} sm={20} md={20} lg={20}>
                    <Typography.Title level={2}>Order History</Typography.Title>
                    {orderDummyData.map((order, index) => (
                        <div key={index} style={{ margin: "10px 0" }}>
                            <Typography.Title level={5}>
                                {order.purchasedDateTime}
                            </Typography.Title>
                            <OrderCard {...order} />
                        </div>
                    ))}
                </Col>
            </Row>
        </div>
    );
};

export default History;
