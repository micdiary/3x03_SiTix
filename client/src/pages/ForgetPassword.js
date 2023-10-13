import React from "react";
import * as constants from "../constants";
import { Button, Form, Input, Row, Col, Card, Typography } from "antd";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Buttons from "../components/Buttons";
import { cardStyle, inputStyle, typographyStyle } from "./PagesStyles";
import { forgetPassword } from "../api/account";
import { showNotification } from "../components/Notification";

const ForgetPassword = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        const req = { email: values.email };
        forgetPassword(req)
            .then((res) => {
                showNotification(res.message);
                form.resetFields();
            })
            .catch((err) => {
                showNotification(err.message);
            });
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
            <Col xs={20} sm={16} md={12} lg={8}>
                <Typography.Title level={2} style={typographyStyle}>
                    Forgot password?
                </Typography.Title>
                <Typography.Title level={5} style={typographyStyle}>
                    No worries, we'll send you the reset instructions.
                </Typography.Title>
                <Card style={cardStyle}>
                    <Form form={form} onFinish={onFinish}>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!",
                                },
                                {
                                    type: "email",
                                    message:
                                        "Please enter a valid email address!",
                                },
                            ]}
                        >
                            <Input
                                style={inputStyle}
                                prefix={<UserOutlined />}
                                placeholder="Email"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Buttons text="Reset Password" />
                        </Form.Item>
                    </Form>
                    <Button type="text">
                        <Link to={constants.LOGIN_URL}>
                            <Typography>
                                <ArrowLeftOutlined /> Back to Login
                            </Typography>
                        </Link>
                    </Button>
                </Card>
            </Col>
        </Row>
    );
};

export default ForgetPassword;
