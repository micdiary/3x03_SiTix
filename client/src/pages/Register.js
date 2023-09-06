import React, { useState } from "react";
import * as constants from "../constants";
import { register } from "../api/account";
import { useNavigate } from "react-router-dom";
import CustomModal from "../components/Modal";
import { showNotification } from "../components/Notification";
import { Col, Row, Form, Input, Button, Typography, Card, Select } from "antd";

const { Option } = Select;
const aStyle = { color: "#B59410" };
const marginBottomOneStyle = { marginBottom: "25px" };
const inputStyle = { height: "30px", borderRadius: "50px" };
const typographyStyle = { textAlign: "center", marginBottom: "30px" };
const cardStyle = { padding: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" };
const buttonStyle = {
    width: "100%",
    height: "50px",
    color: "white",
    borderRadius: "50px",
    marginBottom: "5px",
    backgroundColor: "black",
    transition: "background-color 0.3s, color 0.3s",
};

const Register = () => {
    const navigate = useNavigate();
    // [variable, setVariable] = useState(value)
    const [modal2Open, setModal2Open] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState("Title");

    const buttonMouseOut = (e) => {
        e.currentTarget.style.backgroundColor = "black";
        e.currentTarget.style.color = "white";
    };

    const buttonMouseOver = (e) => {
        e.currentTarget.style.backgroundColor = "white";
        e.currentTarget.style.color = "black";
        e.currentTarget.style.border = "2px solid black";
    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="65">+65</Option>
            </Select>
        </Form.Item>
    );

    const closeModal = (isOpen) => {
        setModal2Open(isOpen);
    };

    const handleOpenModal = () => {
        setModalTitle(<>Email Verification</>);
        setModalContent(
            <>
                <p>New contents...</p>
                <p>New contents...</p>
                <p>New contents...</p>
            </>
        );
        setModal2Open(true);
    };
    const handleModalOnOk = () => {
        navigate(constants.LOGIN_URL);
    };

    const onFinish = (values) => {
        const req = {
            username: values.username,
            lastname: values.last_name,
            first_name: values.first_name,
            email: values.email,
            password: values.password,
        };
        register(req)
            .then((res) => {
                showNotification(res.message);
                handleOpenModal();
                // navigate();
            })
            .catch((err) => {
                showNotification(err.message);
            });
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
            <Col xs={20} sm={20} md={16} lg={12}>
                <Typography.Title style={typographyStyle} level={1}>
                    Sign Up
                </Typography.Title>
                <Card style={cardStyle}>
                    <Form
                        layout="vertical"
                        name="register"
                        initialValues={{ prefix: "65" }}
                        onFinish={onFinish}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your username.",
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message:
                                        "Username can only contain letters, numbers, and underscores.",
                                },
                            ]}
                            style={marginBottomOneStyle}
                        >
                            <Input style={inputStyle} placeholder="Username" />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    name="first_name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter your first name.",
                                        },
                                        {
                                            pattern: /^[a-zA-Z]+$/,
                                            message:
                                                "First name can only contain letters.",
                                        },
                                    ]}
                                    style={marginBottomOneStyle}
                                >
                                    <Input
                                        style={inputStyle}
                                        placeholder="First Name"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    name="last_name"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter your last name.",
                                        },
                                        {
                                            pattern: /^[a-zA-Z]+$/,
                                            message:
                                                "First name can only contain letters.",
                                        },
                                    ]}
                                    style={marginBottomOneStyle}
                                >
                                    <Input
                                        style={inputStyle}
                                        placeholder="Last Name"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="phone_number"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter phone number.",
                                },
                                {
                                    pattern: /^[89]\d{7}$/,
                                    message:
                                        "Please enter a valid 8-digit phone number starting with 8 or 9 and without spaces.",
                                },
                            ]}
                            style={marginBottomOneStyle}
                        >
                            <Input
                                sstyle={inputStyle}
                                addonBefore={prefixSelector}
                                placeholder="Phone Number"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter a valid Email.",
                                    type: "email",
                                },
                            ]}
                            style={marginBottomOneStyle}
                        >
                            <Input style={inputStyle} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your Password.",
                                },
                                {
                                    min: 8,
                                    message:
                                        "Password must contain at least 8 characters!",
                                },
                                {
                                    pattern:
                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message:
                                        "Password must contain at least a number, an uppercase, a lower case and a special charatcer!",
                                },
                            ]}
                            hasFeedback
                            style={marginBottomOneStyle}
                        >
                            <Input.Password
                                style={inputStyle}
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirm_password"
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm your Password.",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("password") === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "The password that you entered do not match!"
                                            )
                                        );
                                    },
                                }),
                            ]}
                            style={marginBottomOneStyle}
                        >
                            <Input.Password
                                style={inputStyle}
                                placeholder="Comfirm"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                style={buttonStyle}
                                onMouseOut={buttonMouseOut}
                                onMouseOver={buttonMouseOver}
                                htmlType="submit"
                                onClick={handleOpenModal}
                            >
                                Sign Up
                            </Button>
                            <div>
                                Already have an account?{" "}
                                <a style={aStyle} href={constants.LOGIN_URL}>
                                    Log in
                                </a>
                            </div>
                        </Form.Item>
                        <CustomModal
                            modal2Open={modal2Open}
                            closeModal={closeModal}
                            modalTitle={modalTitle}
                            modalContent={modalContent}
                            onOk={handleModalOnOk}
                        />
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default Register;
