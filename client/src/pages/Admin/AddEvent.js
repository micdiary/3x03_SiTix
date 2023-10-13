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

const AddEvent = () => {
    const { Option } = Select;
    const [eventForm] = Form.useForm();

    const [categoryCount, setCategoryCount] = useState(1);
    const dummyVenues = ["Venue 1", "Venue 2", "Venue 3"];
    const addEventFormItem = [
        {
            label: "Event Name",
            name: "event_name",
            rules: [{ required: true, message: "Required" }],
            input: <Input style={inputStyle} />,
        },
        {
            label: "Event Date",
            name: "event_date",
            rules: [{ required: true, message: "Required" }],
            input: <DatePicker style={inputStyle} />,
        },
        {
            label: "Event Venue",
            name: "event_venue",
            rules: [{ required: true, message: "Required" }],
            input: (
                <Select>
                    {dummyVenues.map((venue) => (
                        <Option key={venue} value={venue}>
                            {venue}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            label: "Description",
            name: "description",
            rules: [{ required: true, message: "Required" }],
            input: <Input style={inputStyle} />,
        },
        {
            label: "Total Seats Available",
            name: "total_seats",
            rules: [{ required: true, message: "Required" }],
            input: <Input style={inputStyle} />,
        },
        {
            label: "No. of Category",
            name: "category_count",
            rules: [{ required: true, message: "Required" }],
            input: (
                <Select
                    style={inputStyle}
                    onChange={(value) => setCategoryCount(value)}
                >
                    {Array.from({ length: 10 }, (_, index) => (
                        <Option key={index + 1} value={index + 1}>
                            {index + 1}
                        </Option>
                    ))}
                </Select>
            ),
        },
        // Conditional rendering of price input fields
        ...Array.from({ length: categoryCount }, (_, index) => ({
            label: `Price for Category ${index + 1}`,
            name: `category_price_${index + 1}`,
            rules: [{ required: true, message: "Required" }],
            input: <Input style={inputStyle} />,
        })),
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
                            Add Event
                        </Typography.Title>
                        <Form
                            form={eventForm}
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

export default AddEvent;
