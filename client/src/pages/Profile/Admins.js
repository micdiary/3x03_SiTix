import { Form, Input, Typography } from "antd";
import React, { useEffect } from "react";
import { editProfile } from "../../api/account";
import { getToken } from "../../utils/account";
import { showNotification } from "../../components/Notification";
import Buttons from "../../components/Buttons";
import { inputStyle } from "../PagesStyles";
import { useNavigate } from "react-router-dom";
import { ADMIN_URL } from "../../constants";

const Admins = ({ profile, setProfile, updateProfile, setUpdateProfile }) => {
    let navigate = useNavigate();
    const [editForm] = Form.useForm();

    const onEditFinish = (values) => {
        const req = {
            token: getToken(),
            username: values.username,
        };
        editProfile(req)
            .then((res) => {
                showNotification(res.message);
                // update the profile data to reflect changes
                setProfile({ ...profile, ...values });
                // trigger the second useEffect
                setUpdateProfile(!updateProfile);
                navigate(ADMIN_URL);
            })
            .catch((err) => {
                showNotification(err.message);
            });
    };

    useEffect(() => {
        editForm.setFieldsValue({
            username: profile.username,
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

export default Admins;
