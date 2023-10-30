import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Card, Spin } from "antd";
import Payment from "./Payment";
import OrderCard from "../../components/OrderCard";
import { useLocation } from "react-router-dom";
import { eventStore, purchaseStore } from "../../store/Order";
import { formatDate } from "../../utils/date";

const Purchase = () => {
    let location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const event_id = queryParams.get("event");
    const [isLoading, setIsLoading] = useState(false);
    const purchaseData = purchaseStore((state) => state.purchaseData);
    const eventData = eventStore((state) => state.eventData);

    const eventDate = new Date(eventData.date);
    const { date, day, time } = formatDate(eventDate);

    let price = "0";
    let seat_id = "0";
    for (let i = 0; i < eventData.venue_seat_type.length; i++) {
        if (eventData.venue_seat_type[i].type_name === purchaseData.ticket) {
            if (
                eventData.venue_seat_type[i].seat_type_id ===
                eventData.seat_type[i].seat_type_id
            ) {
                seat_id = eventData.seat_type[i].seat_type_id;
                price = eventData.seat_type[i].price;
            }
        }
    }

    let booking_fee = 6;
    const orderData = {
        event_name: eventData.event_name,
        event_venue: eventData.venue.venue_name,
        event_date: date,
        event_day: day,
        event_time: time,
        seat_number: "Free Seating",
        ticket_type: purchaseData.ticket,
        event_price: price,
        qty: purchaseData.quantity,
        booking_fee: booking_fee,
        total_price: booking_fee + price * purchaseData.quantity,
    };

    const orderItem = {
        event_id: event_id,
        seat_type_id: seat_id,
        venue_id: eventData.venue.venue_id,
        total_price: orderData.total_price,
        quantity: purchaseData.quantity,
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            <Row justify="center" align="middle">
                <Col xs={22} sm={20} md={20} lg={20}>
                    <Spin size="large" spinning={isLoading}>
                        <Row justify="center"></Row>
                        <Typography.Title level={2}>Payment</Typography.Title>
                        <div style={{ margin: "10px 0" }}>
                            <OrderCard {...orderData} />
                        </div>
                        <Payment
                            orderItem={orderItem}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    </Spin>
                </Col>
            </Row>
        </div>
    );
};

export default Purchase;
