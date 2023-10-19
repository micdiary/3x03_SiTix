import React from "react";
import * as constants from "../constants";
import { register } from "../api/account";
import { useNavigate } from "react-router-dom";
import Buttons from "../components/Buttons";
import { showNotification } from "../components/Notification";
import { Col, Row, Form, Input, Typography, Card } from "antd";
import { getPasswordValidationRule } from "../utils/validation";
import {
  aStyle,
  cardStyle,
  inputStyle,
  marginBottomOneStyle,
  typographyStyle,
} from "./PagesStyles";

const Register = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const req = {
      username: values.username,
      last_name: values.last_name,
      first_name: values.first_name,
      email: values.email,
      password: values.password,
    };
    register(req)
      .then((res) => {
        showNotification(res.message);
        navigate(constants.LOGIN_URL);
      })
      .catch((err) => {
        showNotification(err.message);
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
      <Col xs={20} sm={20} md={16} lg={10}>
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
                {
                  max: 50,
                  message: "Username can be at most 50 characters long.",
                  //prevents ddos which can consume significant server resources or leads to application instability.
                  //provides more descriptive error message for users
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
                      message: "Please enter your first name.",
                    },
                    {
                      pattern: /^[a-zA-Z]+$/,
                      message: "First name can only contain letters.",
                    },
                  ]}
                  style={marginBottomOneStyle}
                >
                  <Input style={inputStyle} placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  name="last_name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your last name.",
                    },
                    {
                      pattern: /^[a-zA-Z]+$/,
                      message: "Last name can only contain letters.",
                    },
                  ]}
                  style={marginBottomOneStyle}
                >
                  <Input style={inputStyle} placeholder="Last Name" />
                </Form.Item>
              </Col>
            </Row>
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
                // ...getPasswordValidationRule(),
              ]}
              hasFeedback
              style={marginBottomOneStyle}
            >
              <Input.Password style={inputStyle} placeholder="Password" />
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
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The password that you entered do not match!")
                    );
                  },
                }),
              ]}
              style={marginBottomOneStyle}
            >
              <Input.Password
                style={inputStyle}
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Form.Item>
              <Buttons text="Sign Up" />
              <div>
                Already have an account?{" "}
                <a style={aStyle} href={constants.LOGIN_URL}>
                  Log in
                </a>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;
