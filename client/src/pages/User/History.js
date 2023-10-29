import React, { useEffect, useState } from "react";
import { Row, Col, Typography } from "antd";
import OrderCard from "../../components/OrderCard";
import { getOrder } from "../../api/order";
import { showNotification } from "../../components/Notification";
import { formatDate } from "../../utils/date";
import { getEventDetails } from "../../api/event";

const History = () => {
    const [order, setOrder] = useState([]);

    useEffect(() => {
        getOrder()
            .then((res) => {
                console.log(res.orders);
                setOrder(res.orders);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    }, []);

    return (
        <div style={{ minHeight: "100vh" }}>
            <Row justify="center" align="middle">
                <Col xs={22} sm={20} md={20} lg={20}>
                    <Typography.Title level={2}>Order History</Typography.Title>
                    {order &&
                        order.map((orderItem, index) => {
                            const orderDate = new Date(orderItem.created_at);
                            const { date, day, time } = formatDate(orderDate);

                            return (
                                <div key={index} style={{ margin: "10px 0" }}>
                                    <Typography.Title level={5}>
                                        {date}, {time}
                                    </Typography.Title>
                                    <OrderCard
                                        order_id={orderItem.order_id}
                                        date={orderItem.event.date}
                                        event_name={orderItem.event.event_name}
                                        event_venue={orderItem.venue.venue_name}
                                        seat_number="Free seating"
                                        ticket_type={
                                            orderItem.seat_type.type_name
                                        }
                                        booking_fee={6}
                                        total_price={orderItem.total_price}
                                    />
                                </div>
                            );
                        })}
                </Col>
            </Row>
        </div>
    );
};

export default History;
