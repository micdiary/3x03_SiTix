import { Form, Input, Typography } from "antd";
import React, { useEffect } from "react";
import { editProfile } from "../../api/account";
import { getToken } from "../../utils/account";
import { showNotification } from "../../components/Notification";
import Buttons from "../../components/Buttons";
import { inputStyle } from "../PagesStyles";

const Users = ({ profile, setProfile, updateProfile, setUpdateProfile }) => {
    const [editForm] = Form.useForm();

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
                // update the profile data to reflect changes
                setProfile({ ...profile, ...values });
                // trigger the second useEffect
                setUpdateProfile(!updateProfile);
            })
            .catch((err) => {
                showNotification(err.message);
            });
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

    return (
        <div>
            <Typography.Title level={3} style={{ margin: "15px 5px" }}>
                Profile
            </Typography.Title>
            <Form form={editForm} onFinish={onEditFinish} layout="vertical">
                {profileFormItems.map((item) => (
                    <div style={{ margin: "10px" }} key={item.name}>
                        <Form.Item
                            label={item.label}
                            name={item.name}
                            rules={item.rules}
                            hasFeedback
                        >
                            <Input {...item.inputProps} style={inputStyle} />
                        </Form.Item>
                    </div>
                ))}
                <div style={{ margin: "10px" }}>
                    <Buttons text="Submit" />
                </div>
            </Form>
        </div>
    );
};

export default Users;
