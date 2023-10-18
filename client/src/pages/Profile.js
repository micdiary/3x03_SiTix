import { Button, Form, Input, Typography } from "antd";
import * as constants from "../constants";
import React, { useState, useEffect } from "react";
import { editProfile, getProfile, resetPassword } from "../api/account";
import { getToken } from "../utils/account";
import { showNotification } from "../components/Notification";
import Buttons from "../components/Buttons";
import { inputStyle, marginBottomOneStyle } from "./PagesStyles";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    let navigate = useNavigate();
    const [profile, setProfile] = useState({});
    const [updateProfile, setUpdateProfile] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(true);
    const [editForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    useEffect(() => {
        getProfile().then((res) => {
            if (res.user !== undefined) {
                // res.user is array
                setProfile(res.user[0]);
            }
        });
    }, [updateProfile]);

    const onEditFinish = (values) => {
        const req = {
            token: getToken(),
            username: values.username,
            last_name: values.last_name,
            first_name: values.first_name,
        };
        editProfile(req)
            .then((res) => {
                showNotification(res.message);
                // Update the profile data to reflect changes
                setProfile({ ...profile, ...values });
                setUpdateProfile(!updateProfile); // Trigger the second useEffect
            })
            .catch((err) => {
                showNotification(err.message);
            });
    };

    const onChangePasswordFinish = (values) => {
        const req = {
            token: getToken(),
            password: values.password,
            newPassword: values.new_password,
        };
        resetPassword(req)
            .then((res) => {
                showNotification(res.message);
                navigate(constants.PROFILE_URL);
            })
            .catch((err) => {});
        passwordForm.resetFields();
    };

    useEffect(() => {
        editForm.setFieldsValue({
            username: profile.username,
            last_name: profile.last_name,
            first_name: profile.first_name,
            email: profile.email,
        });
    });

    const profileFormItems = [
        {
            name: "username",
            label: "Username",
            rules: [],
            inputProps: { disabled: false },
        },
        {
            name: "first_name",
            label: "First Name",
            rules: [],
            inputProps: { disabled: false },
        },
        {
            name: "last_name",
            label: "Last Name",
            rules: [],
            inputProps: { disabled: false },
        },
        {
            name: "email",
            label: "Email",
            rules: [],
            inputProps: { disabled: true },
        },
    ];

    const toggleForm = () => {
        setIsEditingProfile(!isEditingProfile);
    };

    return (
        <div style={{ margin: "10px" }}>
            {isEditingProfile ? (
                <Form form={editForm} onFinish={onEditFinish}>
                    {profileFormItems.map((item) => (
                        <div style={{ margin: "10px" }} key={item.name}>
                            <Form.Item
                                label={item.label}
                                name={item.name}
                                rules={item.rules}
                                hasFeedback
                            >
                                <Input {...item.inputProps} />
                            </Form.Item>
                        </div>
                    ))}
                    <div style={{ margin: "10px" }}>
                        <Buttons text="Submit" />
                    </div>
                </Form>
            ) : (
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
            )}
            <div style={{ margin: "10px" }}>
                <Buttons
                    text={isEditingProfile ? "Change Password" : "Edit Profile"}
                    onClick={toggleForm}
                />
            </div>
        </div>
    );
};

export default Profile;
