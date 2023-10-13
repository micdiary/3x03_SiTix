import { PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    Typography,
    Upload,
} from "antd";
import React, { useState } from "react";
import Buttons from "../../components/Buttons";
import { cardStyle, inputStyle, marginBottomOneStyle } from "../PagesStyles";

const AddVenue = () => {
    const [venueForm] = Form.useForm();
    const addEventFormItem = [
        {
            label: "Venue Name",
            name: "venue_name",
            rules: [{ required: true, message: "Required" }],
            input: <Input style={inputStyle} />,
        },
        {
            label: "Image Upload",
            name: "image",
            rules: [{ required: true, message: "Required" }],
            input: (
                <Upload
                    name="image"
                    listType="picture"
                    beforeUpload={() => false}
                >
                    <Button style={inputStyle} icon={<PlusOutlined />}>
                        Upload Image
                    </Button>
                </Upload>
            ),
        },
    ];

    return (
        <div>
            <Row justify="center">
                <Col span={23}>
                    <Card style={{ margin: "40px", ...cardStyle }}>
                        <Typography.Title
                            level={3}
                            style={marginBottomOneStyle}
                        >
                            Add Venue
                        </Typography.Title>
                        <Form
                            form={venueForm}
                            layout="vertical"
                            // onFinish={onFinish}
                        >
                            {addEventFormItem.map((item) => (
                                <Form.Item
                                    label={item.label}
                                    name={item.name}
                                    rules={item.rules}
                                    key={item.name}
                                >
                                    {item.input}
                                </Form.Item>
                            ))}
                            <Row justify="center">
                                <Buttons text="Submit" width="20%" />
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AddVenue;
