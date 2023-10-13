import React from "react";
import { Card, Col, Divider, Row, Typography } from "antd";
import { dividerStyle } from "../pages/PagesStyles";

const OrderCard = ({
    orderNumber,
    eventTitle,
    eventVenue,
    eventDate,
    eventDay,
    eventTime,
    seatNumber,
    eventCat,
    eventPrice,
    qty,
    totalPrice,
}) => {
    return (
        <Card title={`Order No. ${orderNumber}`} bordered={false}>
            <Row>
                <Col span={24}>
                    <Typography.Text strong style={{ fontSize: "16px" }}>
                        {eventTitle}
                    </Typography.Text>
                    <div>
                        {eventVenue}
                        <br />
                        {eventDate} {`(${eventDay})`}, {eventTime}
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
                                {`Seat ${seatNumber}`}
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
                                {`CAT ${eventCat}`}
                                <br /> {`$ ${eventPrice}`}
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
                    <p>$ 4</p>
                    <p style={{ color: "red" }}>{`$ ${totalPrice}`}</p>
                </Col>
            </Row>
        </Card>
    );
};

export default OrderCard;
