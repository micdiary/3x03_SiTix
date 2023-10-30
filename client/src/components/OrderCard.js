import React from "react";
import { Card, Col, Divider, Row, Typography } from "antd";
import { dividerStyle } from "../pages/PagesStyles";
import { formatDate } from "../utils/date";

const OrderCard = (orderData) => {
    const eventDate = new Date(orderData.date);
    const { date, day, time } = formatDate(eventDate);
    return (
        <Card
            title={`Order No. (${
                orderData.order_id ? orderData.order_id : ""
            })`}
            bordered={false}
        >
            <Row>
                <Col span={24}>
                    <Typography.Text strong style={{ fontSize: "16px" }}>
                        {orderData.event_name}
                    </Typography.Text>
                    <div>
                        {orderData.event_venue}
                        <br />
                        {orderData.event_date
                            ? orderData.event_date
                            : date}{" "}
                        {`(${orderData.event_day ? orderData.event_day : day})`}
                        , {orderData.event_time ? orderData.event_time : time}
                    </div>
                    <Divider style={dividerStyle} />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Row>
                        <Col span={7}>
                            <Typography.Text
                                strong
                                style={{ fontSize: "16px" }}
                            >
                                Seat Info
                            </Typography.Text>
                        </Col>
                        <Col span={5}>
                            <div>
                                {`${orderData.seat_number}`}
                                <br />
                                {"-"}
                            </div>
                        </Col>
                    </Row>
                    <Divider style={dividerStyle} />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Row>
                        <Col span={7}>
                            <Typography.Text
                                strong
                                style={{ fontSize: "16px" }}
                            >
                                Ticket Info
                            </Typography.Text>
                        </Col>
                        <Col span={5}>
                            <div>
                                {`${orderData.ticket_type}`}
                                <br />{" "}
                                {`$ ${
                                    orderData.event_price
                                        ? orderData.event_price
                                        : "-"
                                }`}
                            </div>
                        </Col>
                    </Row>
                    <Divider style={dividerStyle} />
                </Col>
            </Row>
            <Row justify="end">
                <Col xs={12} sm={12} md={4} lg={4}>
                    <p>Ticket Qty :</p>
                    <p>Booking Fee :</p>
                    <p>Total :</p>
                </Col>
                <Col xs={12} sm={12} md={4} lg={2}>
                    <p>{orderData.qty ? orderData.qty : "-"}</p>
                    <p>{`$ ${orderData.booking_fee}`}</p>
                    <p
                        style={{ color: "red" }}
                    >{`$ ${orderData.total_price}`}</p>
                </Col>
            </Row>
        </Card>
    );
};

export default OrderCard;
