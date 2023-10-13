import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Typography, Upload } from "antd";
import React from "react";

const EventManagement = () => {
    const addEventFormItem = [
        {
            label: "Event Name",
            name: "event_name",
            rules: [{ required: true, message: "Required" }],
        },
        {
            label: "Event Date & Time",
            name: "event_date",
            rules: [{ required: true, message: "Required" }],
        },
        {
            label: "Description",
            name: "description",
            rules: [{ required: true, message: "Required" }],
        },
        {
            label: "Image Upload",
            name: "image",
            rules: [],
        },
        {
            label: "Total Seats Available",
            name: "total_seats",
            rules: [
                {
                    required: true,
                    message: "Please enter Total Seats Available",
                },
            ],
        },
    ];

    return (
        <div>
            <Typography.Title level={3}>Add Event</Typography.Title>
            <Row>
                <Col span="23">
                    <Form name="eventForm">
                        {addEventFormItem.map((item) => (
                            <Form.Item
                                label={item.label}
                                name={item.name}
                                rules={item.rules}
                                key={item.name}
                            >
                                {item.name === "image" ? (
                                    // You can add the Upload component here for image uploading
                                    <Upload
                                        name="image"
                                        listType="picture"
                                        beforeUpload={() => false}
                                    >
                                        <Button icon={<PlusOutlined />}>
                                            Upload Image
                                        </Button>
                                    </Upload>
                                ) : (
                                    <Input />
                                )}
                            </Form.Item>
                        ))}
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default EventManagement;
