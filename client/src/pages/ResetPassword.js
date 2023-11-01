import React from "react";
import * as constants from "../constants";
import { Card, Col, Form, Input, Row, Typography } from "antd";
import Buttons from "../components/Buttons";
import {
    typographyStyle,
    marginBottomOneStyle,
    inputStyle,
    cardStyle,
} from "./PagesStyles";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { resetPassword } from "../api/account";
import { showNotification } from "../components/Notification";
import { getPasswordValidationRule } from "../utils/validation";

const ResetPassword = () => {
    let navigate = useNavigate();
    let params = useLocation();

    const onFinish = (values) => {
        console.log(params)
        const req = {
            token: params.search.split("=")[1],
            newPassword: values.new_password,
        };
        resetPassword(req)
            .then((res) => {
                showNotification(res.message);
                navigate(constants.LOGIN_URL);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
            <Col xs={20} sm={16} md={12} lg={8}>
                <Typography.Title style={typographyStyle} level={2}>
                    Reset Password
                </Typography.Title>
                <Card style={cardStyle}>
                    <Form
                        layout="vertical"
                        name="forget-password"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="new_password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your new password.",
                                },
                                ...getPasswordValidationRule(),
                            ]}
                            hasFeedback
                            style={marginBottomOneStyle}
                        >
                            <Input.Password
                                style={inputStyle}
                                placeholder="New Password"
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirm_password"
                            dependencies={["new_password"]}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please confirm your new password.",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("new_password") ===
                                                value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "The new password that you entered do not match!"
                                            )
                                        );
                                    },
                                }),
                            ]}
                            style={marginBottomOneStyle}
                        >
                            <Input.Password
                                style={inputStyle}
                                placeholder="Confirm New Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Buttons text="Reset" />
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default ResetPassword;
