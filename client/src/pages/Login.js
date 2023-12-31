import React, { useState } from "react";
import { login, submitOTP } from "../api/account";
import * as constants from "../constants";
import Buttons from "../components/Buttons";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Row, Form, Input, Typography, Card, Spin } from "antd";
import {
    aStyle,
    cardStyle,
    inputStyle,
    marginBottomOneStyle,
    typographyStyle,
} from "./PagesStyles";
import { userStore } from "../store/User";
import Modals from "../components/Modal";
import { showNotification } from "../components/Notification";

const Login = () => {
    let navigate = useNavigate();
    const setStoreToken = userStore((state) => state.setToken);
    const setStoreUserType = userStore((state) => state.setUserType);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        setIsLoading(true);
        const req = {
            username: values.username,
            password: values.password,
        };

        login(req)
            .then((res) => {
                showNotification(res.message);
                setIsLoading(false);
                setModalVisible(true);

                // global state
                setStoreToken(res.token);

                // local storage
                localStorage.setItem("token", res.token);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const submitOtp = (values) => {
        const req = {
            otp: values.loginOTP,
            token: localStorage.getItem("token"),
        };
        submitOTP(req)
            .then((res) => {
                showNotification(res.message);
                setModalVisible(false);

                setStoreUserType(res.userType);
                localStorage.setItem("userType", res.userType);

                if (res.userType === "superadmin") {
                    navigate(constants.SUPERADMIN_URL);
                } else if (res.userType === "admin") {
                    navigate(constants.ADMIN_URL);
                } else {
                    navigate(constants.HOME_URL);
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const handleModalOk = () => {
        form.submit();
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const modalForm = (formItems) => {
        return formItems.map((item, index) => (
            <Form.Item
                name={item.name}
                rules={item.rules}
                key={index}
                valuePropName={item.valuePropName}
                style={marginBottomOneStyle}
            >
                {item.input}
            </Form.Item>
        ));
    };

    const formItems = [
        {
            name: "loginOTP",
            rules: [
                {
                    required: true,
                    message: "Required",
                },
            ],
            input: <Input style={inputStyle} placeholder="OTP" />,
        },
    ];

    return (
        <Row
            justify="center"
            align="middle"
            style={{
                minHeight: "100vh",
                background: `url(https://pngimg.com/d/smoke_PNG55185.png) no-repeat center`,
            }}
        >
            <Col xs={20} sm={16} md={12} lg={8}>
                <Typography.Title style={typographyStyle} level={1}>
                    Login
                </Typography.Title>
                <Spin size="large" spinning={isLoading}>
                    <Card style={cardStyle}>
                        <Form
                            layout="vertical"
                            name="normal_login"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your Username.",
                                        type: "string",
                                    },
                                    {
                                        max: 50,
                                        message:
                                            "Username can be at most 50 characters long.",
                                        //Extremely long usernames can potentially be used to perform denial-of-service attacks, either unintentionally or intentionally
                                        //Prevent consuming significant server resources or leads to application instability.
                                    },
                                ]}
                                style={marginBottomOneStyle}
                            >
                                <Input
                                    style={inputStyle}
                                    prefix={<UserOutlined />}
                                    placeholder="Username"
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your Password.",
                                    },
                                    {
                                        max: 50,
                                        message:
                                            "Password can be at most 50 characters long.",
                                        //Extremely long characters can potentially be used to perform denial-of-service attacks, either unintentionally or intentionally
                                        //Prevent consuming significant server resources or leads to application instability.
                                    },
                                ]}
                            >
                                <Input.Password
                                    style={inputStyle}
                                    prefix={<LockOutlined />}
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item
                                style={{
                                    marginTop: "-20px",
                                    display: "flex",
                                    justifyContent: "right",
                                }}
                            >
                                <a
                                    style={aStyle}
                                    href={constants.FORGET_PASSWORD_URL}
                                >
                                    Forgot Password?
                                </a>
                            </Form.Item>
                            <Form.Item>
                                <Buttons
                                    arialLabel="login button"
                                    text="Login"
                                />
                                Or{" "}
                                <a style={aStyle} href={constants.REGISTER_URL}>
                                    register now!
                                </a>
                            </Form.Item>
                        </Form>
                    </Card>
                </Spin>
                <Modals
                    modal2Open={modalVisible}
                    closeModal={handleModalCancel}
                    modalTitle={"OTP"}
                    modalContent={
                        <Form form={form} onFinish={submitOtp}>
                            {modalForm(formItems)}
                        </Form>
                    }
                    onOk={handleModalOk}
                />
            </Col>
        </Row>
    );
};

export default Login;
