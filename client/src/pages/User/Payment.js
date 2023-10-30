import React from "react";
import { Card, Form, Input, Row, Col, Spin } from "antd";
import visa from "../../assets/visa.png";
import amex from "../../assets/amex.png";
import mastercard from "../../assets/mastercard.png";
import { inputStyle } from "../PagesStyles";
import { createOrder } from "../../api/order";
import { HISTORY_URL } from "../../constants";
import Buttons from "../../components/Buttons";
import { getToken } from "../../utils/account";
import { showNotification } from "../../components/Notification";
import { validateCardNumber, validateExpiryDate } from "../../utils/validation";
import { useNavigate } from "react-router-dom";

const Payment = ({ orderItem, isLoading, setIsLoading }) => {
    let navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        setIsLoading(true);
        const req = {
            token: getToken(),
            event_id: orderItem.event_id,
            seat_type_id: orderItem.seat_type_id,
            venue_id: orderItem.venue_id,
            total_price: orderItem.total_price,
            credit_card: values.card_number.replace(/\s/g, ""),
            quantity: orderItem.quantity,
        };
        console.log(req);
        createOrder(req)
            .then((res) => {
                showNotification(res.message);
                form.resetFields();
                setTimeout(() => {
                    setIsLoading(false);
                    navigate(HISTORY_URL);
                }, 3000);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    };

    return (
        <Spin size="large" spinning={isLoading}>
            <div style={{ margin: "10px 0" }}>
                <Card title="Payment Details" bordered={false}>
                    <Form
                        form={form}
                        style={{ marginTop: "15px" }}
                        layout="vertical"
                        name="card-payment"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="card_number"
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
                            />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    name="expiry_date"
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
                            <img
                                src={amex}
                                alt="amex"
                                style={{ width: "30px" }}
                            />
                        </div>
                        <Buttons text="Pay" />
                    </Form>
                </Card>
            </div>
        </Spin>
    );
};

export default Payment;
