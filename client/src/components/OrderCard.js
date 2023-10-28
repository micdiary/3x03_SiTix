import React from "react";
import { Card, Col, Divider, Row, Typography } from "antd";
import { dividerStyle } from "../pages/PagesStyles";

const OrderCard = ({
    event_name,
    event_venue,
    date,
    event_day,
    event_time,
    seat_number,
    ticket_type,
    event_price,
    qty,
    booking_fee,
    total_price,
}) => {
    return (
        <Card title={`Order`} bordered={false}>
            <Row>
                <Col span={24}>
                    <Typography.Text strong style={{ fontSize: "16px" }}>
                        {event_name}
                    </Typography.Text>
                    <div>
                        {event_venue}
                        <br />
                        {date} {`(${event_day})`}, {event_time}
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
                                {`${seat_number}`}
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
                                {`${ticket_type}`}
                                <br /> {`$ ${event_price}`}
                            </div>
                        </Col>
                    </Row>
                    <Divider style={dividerStyle} />
                </Col>
            </Row>
            <Row justify="end">
                <Col xs={12} sm={12} md={4} lg={4}>
                    <p>Ticket Qty :</p>
                    <p>Delivery Fee :</p>
                    <p>Total :</p>
                </Col>
                <Col xs={12} sm={12} md={4} lg={2}>
                    <p>{qty}</p>
                    <p>{`$ ${booking_fee}`}</p>
                    <p style={{ color: "red" }}>{`$ ${total_price}`}</p>
                </Col>
            </Row>
        </Card>
    );
};

export default OrderCard;
