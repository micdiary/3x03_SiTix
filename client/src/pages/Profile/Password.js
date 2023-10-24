import React from "react";
import { Form, Input } from "antd";
import Typography from "antd/es/typography/Typography";

import * as constants from "../../constants";
import { getToken } from "../../utils/account";
import { resetPassword } from "../../api/account";

import Buttons from "../../components/Buttons";
import { showNotification } from "../../components/Notification";
import { inputStyle, marginBottomOneStyle } from "../PagesStyles";
import { useNavigate } from "react-router-dom";

const Password = () => {
    const [passwordForm] = Form.useForm();

    const onChangePasswordFinish = (values) => {
        const req = {
            token: getToken(),
            password: values.password,
            newPassword: values.new_password,
        };
        resetPassword(req)
            .then((res) => {
                showNotification(res.message);
            })
            .catch((err) => {
                showNotification(err.message);
            })
            .finally(() => {
                passwordForm.resetFields();
            });
    };

    return (
        <div>
            <Typography.Title level={3} style={{ margin: "15px 5px" }}>
                Change Password
            </Typography.Title>
            <Form form={passwordForm} onFinish={onChangePasswordFinish}>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your current password",
                        },
                    ]}
                    hasFeedback
                    style={marginBottomOneStyle}
                >
                    <Input.Password
                        style={inputStyle}
                        placeholder=" Current Password"
                    />
                </Form.Item>
                <Form.Item
                    name="new_password"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your New password.",
                        },
                        // ...getPasswordValidationRule(),
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
                            message: "Please confirm your new password.",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("new_password") === value
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
                        placeholder="Confirm Password"
                    />
                </Form.Item>
                <div style={{ margin: "10px" }}>
                    <Buttons text="Submit" />
                </div>
            </Form>
        </div>
    );
};

export default Password;
