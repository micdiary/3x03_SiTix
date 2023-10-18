import React from "react";
import { login } from "../api/account";
import * as constants from "../constants";
import Buttons from "../components/Buttons";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Row, Form, Input, Typography, Card } from "antd";
import {
    aStyle,
    cardStyle,
    inputStyle,
    marginBottomOneStyle,
    typographyStyle,
} from "./PagesStyles";
import { userStore } from "../store/User";

const Login = () => {
    let navigate = useNavigate();
    const setStoreToken = userStore((state) => state.setToken);
    const setStoreUserType = userStore((state) => state.setUserType);

    const onFinish = (values) => {
        console.log("Received values of form: ", values);

        const req = {
            username: values.username,
            password: values.password,
        };

        login(req)
            .then((res) => {
                console.log(res);

                // global state
                setStoreToken(res.token);
                setStoreUserType(res.userType);

                // local storage
                localStorage.setItem("token", res.token);
                localStorage.setItem("userType", res.userType);

                // TODO change accordingly depending on usertype
                if (res.userType === "admin") {
                    navigate(constants.SUPERADMIN_URL);
                } else {
                    navigate(constants.HOME_URL);
                }
            })
            .catch((err) => {
                console.log(err);
                alert(err.message);
            });
    };

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
                            <Buttons text="Login" />
                            Or{" "}
                            <a style={aStyle} href={constants.REGISTER_URL}>
                                register now!
                            </a>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default Login;
