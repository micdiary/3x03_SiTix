import React from "react";
import visa from "../assets/visa.png";
import amex from "../assets/amex.png";
import mastercard from "../assets/mastercard.png";
import Buttons from "../components/Buttons";
import { Card, Form, Input, Row, Col } from "antd";
import { validateCardNumber, validateExpiryDate } from "../utils/validation";
import { inputStyle } from "../pages/PagesStyles";

const Payment = () => {
    const onFinish = (values) => {
        console.log("Form values:", values);
    };

    return (
        <div style={{ margin: "10px 0" }}>
            <Card title="Payment Details" bordered={false}>
                <Form
                    style={{ marginTop: "15px" }}
                    layout="vertical"
                    name="card-payment"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="cardNumber"
                        label="Card Number"
                        rules={[
                            {
                                required: true,
                                message: "Please enter card number",
                            },
                            {
                                validator: validateCardNumber,
                            },
                        ]}
                    >
                        <Input
                            style={inputStyle}
                            placeholder="Card Number"
                            maxLength={19}
                            type="number"
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item
                                name="expiryDate"
                                label="Expiry Date"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter expiry date",
                                    },
                                    {
                                        validator: validateExpiryDate,
                                    },
                                ]}
                            >
                                <Input
                                    style={inputStyle}
                                    placeholder="MMYYYY"
                                    maxLength={6}
                                    type="number"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item
                                name="cvv"
                                label="cvc / cvv"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter CVV",
                                    },
                                    {
                                        pattern: /^[0-9]{3,4}$/,
                                        message: "Invalid CVV",
                                    },
                                ]}
                            >
                                <Input
                                    style={inputStyle}
                                    placeholder="CVV"
                                    maxLength={4}
                                    type="number"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "end",
                        }}
                    >
                        <img
                            src={visa}
                            alt="visa"
                            style={{ width: "30px", marginRight: "10px" }}
                        />
                        <img
                            src={mastercard}
                            alt="mastercard"
                            style={{ width: "30px", marginRight: "10px" }}
                        />
                        <img src={amex} alt="amex" style={{ width: "30px" }} />
                    </div>
                    <Buttons text="Pay" />
                </Form>
            </Card>
        </div>
    );
};

export default Payment;
